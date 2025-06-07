
using Microsoft.EntityFrameworkCore;
using TurkAk.Server.Data;
using TurkAk.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<TurkAkDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// HttpClient servisi ekle
builder.Services.AddHttpClient();

// TurkAkaccService servisi
builder.Services.AddScoped<TurkAkaccService>();

// CORS ekleyin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:8080", "http://localhost:5173", "https://localhost:8080")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS kullanın
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
