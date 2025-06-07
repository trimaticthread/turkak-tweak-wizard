using System.Net.Http.Json;
using System.Text.Json;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using TurkAk.Server.Data;
using TurkAk.Server.Models;
using TurkAk.Server.ViewModels;

namespace TurkAk.Server.Services;

public class TurkAkaccService(TurkAkDbContext context, HttpClient httpClient)
{
    public async Task<(bool success, string message)> LoginAsync(TurkAkaccLoginDto dto)
    {
        var response = await httpClient.PostAsJsonAsync("https://api.turkak.org.tr/SSO/signin", new
        {
            username = dto.TurkakAccUserName,
            password = dto.TurkakAccPassword
        });

        if (!response.IsSuccessStatusCode)
            return (false, "Türkak API ile oturum açma başarısız.");

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        if (doc.RootElement.TryGetProperty("Token", out var tokenElement) &&
            doc.RootElement.TryGetProperty("LoginDate", out var loginDateElement))
        {
            var token = tokenElement.GetString();
            var loginDateRaw = loginDateElement.GetString();

            if (string.IsNullOrWhiteSpace(token))
                return (false, "Boş token alındı.");

            if (!DateTime.TryParseExact(
                    loginDateRaw,
                    "yyyy-MM-dd HH:mm",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out var loginDate))
            {
                return (false, $"Geçersiz tarih formatı: {loginDateRaw}");
            }

            var expires = loginDate.AddHours(12);
            var hash = BCrypt.Net.BCrypt.HashPassword(token);

            var entity = await context.TurkAkaccs.FirstOrDefaultAsync();

            if (entity is null)
            {
                entity = new TurkAkacc
                {
                    TurkakAccUserName = dto.TurkakAccUserName,
                    TurkakAccPassword = dto.TurkakAccPassword,
                    Token = hash,
                    TokenExpiry = expires
                };
                context.TurkAkaccs.Add(entity);
            }
            else
            {
                entity.TurkakAccUserName = dto.TurkakAccUserName;
                entity.TurkakAccPassword = dto.TurkakAccPassword;
                entity.Token = hash;
                entity.TokenExpiry = expires;
            }

            await context.SaveChangesAsync();
            return (true, "Giriş başarılı, token veritabanına kaydedildi.");
        }

        return (false, $"Gelen yanıt beklendiği formatta değil: {json}");
    }
}
