using Microsoft.AspNetCore.Mvc;
using TurkAk.Server.Services.Tbds;
using TurkAk.Server.ViewModels.Tbds;

namespace TurkAk.Server.Controllers.Api;

[ApiController]
[Route("api/tbds")]
public class TbdsApiController(TbdsService tbdsService) : ControllerBase
{
    private readonly TbdsService _tbdsService = tbdsService;

    [HttpGet("customers/pre-data")]
    public async Task<IActionResult> GetCustomerPreData()
    {
        var result = await _tbdsService.GetCalibrationCustomerDataAsync();
        return result is null
            ? StatusCode(502, new { message = "Türkak servisine ulaşılamadı." })
            : Ok(result);
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCertificateCustomers()
    {
        var list = await _tbdsService.GetCertificateCustomerListAsync();
        return Ok(list);
    }

    [HttpPost("customers")]
    public async Task<IActionResult> SaveCustomer([FromBody] CalibrationCustomerSaveDto dto)
    {
        var result = await _tbdsService.SaveCalibrationCustomerAsync(dto);
        return result ? Ok(new { status = "success" }) : StatusCode(502, new { status = "fail" });
    }

    [HttpGet("customers/{id}")]
    public async Task<IActionResult> GetCertificateCustomer(Guid id)
    {
        var result = await _tbdsService.GetCertificateCustomerAsync(id);
        return result is null
            ? NotFound(new { message = "Müşteri bulunamadı." })
            : Ok(result);
    }

    [HttpGet("certificates/{id}")]
    public async Task<IActionResult> GetCertificateDetail(Guid id)
    {
        var result = await _tbdsService.GetCertificateDetailAsync(id);
        return result is null
            ? StatusCode(502, new { message = "Türkak servisine ulaşılamadı." })
            : Ok(result);
    }

    [HttpDelete("certificates/{id}")]
    public async Task<IActionResult> DeleteCertificate(Guid id)
    {
        var success = await _tbdsService.DeleteCertificateAsync(id);
        return success
            ? Ok(new { status = "success", message = "Sertifika silindi." })
            : StatusCode(502, new { status = "fail", message = "Türkak servisine ulaşılamadı veya işlem başarısız." });
    }

    [HttpGet("certificates")]
    public async Task<IActionResult> GetCertificateList()
    {
        var list = await _tbdsService.GetCertificateListAsync();
        return list is null
            ? StatusCode(502, new { message = "Sertifika listesi alınamadı." })
            : Ok(list);
    }
}
