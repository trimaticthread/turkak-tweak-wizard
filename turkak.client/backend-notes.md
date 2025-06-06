
# Backend Program.cs'ye eklenecek CORS ayarları:

```csharp
// CORS ekleyin - builder.Services.AddControllers(); öncesine
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// app.UseHttpsRedirection(); sonrasına ekleyin
app.UseCors("AllowReactApp");
```

Bu ayarları ekledikten sonra backend'i yeniden başlatın.
