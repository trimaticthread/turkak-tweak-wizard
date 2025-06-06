using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurkAk.Server.Data;
using TurkAk.Server.ViewModels;

namespace TurkAk.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(TurkAkDbContext context) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] EmployeeLoginDto loginDto)
    {
        var employee = await context.Employees
            .FirstOrDefaultAsync(e =>
                e.EmployeeUserName == loginDto.EmployeeUserName &&
                e.EmployeeStatus);

        if (employee is null)
            return Unauthorized("Kullanıcı bulunamadı.");

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.EmployeePassword, employee.EmployeePassword);
        if (!isPasswordValid)
            return Unauthorized("Şifre hatalı.");

        var token = "authenticated-local-user";
        var tokenExpiry = DateTime.UtcNow.AddHours(8);

        var response = new EmployeeLoginResponseDto
        {
            Token = token,
            EmployeeId = employee.EmployeeId,
            EmployeeNameSurname = employee.EmployeeNameSurname,
            EmployeeRole = employee.EmployeeRole,
            EmployeeUserName = employee.EmployeeUserName,
            TokenExpiry = tokenExpiry.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        };

        return Ok(response);
    }

    [HttpPost("verify-token")]
    public IActionResult VerifyToken()
    {
        return Ok(new { valid = true });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Başarıyla çıkış yapıldı." });
    }
}
