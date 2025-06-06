﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurkAk.Server.Data;
using TurkAk.Server.Models;
using TurkAk.Server.ViewModels;

namespace TurkAk.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewDeviceTypesController(TurkAkDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await context.NewDeviceTypes
            .Include(d => d.ReferenceCalibratorNavigation)
            .ToListAsync();

        var dtoList = list.Select(d => new NewDeviceTypeDto
        {
            NewDeviceTypeId = d.NewDeviceTypeId,
            DeviceTypeName = d.DeviceTypeName,
            DeviceTypeComment = d.DeviceTypeComment,
            ReferenceCalibrator = d.ReferenceCalibrator,
            ReferenceCalibratorName = d.ReferenceCalibratorNavigation?.ReferenceDeviceName ?? ""
        }).ToList();

        return Ok(dtoList);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var d = await context.NewDeviceTypes
            .Include(d => d.ReferenceCalibratorNavigation)
            .FirstOrDefaultAsync(d => d.NewDeviceTypeId == id);

        if (d == null)
            return NotFound();

        var dto = new NewDeviceTypeDto
        {
            NewDeviceTypeId = d.NewDeviceTypeId,
            DeviceTypeName = d.DeviceTypeName,
            DeviceTypeComment = d.DeviceTypeComment,
            ReferenceCalibrator = d.ReferenceCalibrator,
            ReferenceCalibratorName = d.ReferenceCalibratorNavigation?.ReferenceDeviceName ?? ""
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NewDeviceTypeDto dto)
    {
        var exists = await context.ReferenceDeviceAdds
            .AnyAsync(r => r.ReferenceDeviceId == dto.ReferenceCalibrator);

        if (!exists)
            return BadRequest("Geçersiz referans kalibratör ID.");

        var entity = new NewDeviceType
        {
            DeviceTypeName = dto.DeviceTypeName,
            DeviceTypeComment = dto.DeviceTypeComment,
            ReferenceCalibrator = dto.ReferenceCalibrator
        };

        context.NewDeviceTypes.Add(entity);
        await context.SaveChangesAsync();

        dto.NewDeviceTypeId = entity.NewDeviceTypeId;
        return CreatedAtAction(nameof(GetById), new { id = dto.NewDeviceTypeId }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] NewDeviceTypeDto dto)
    {
        if (id != dto.NewDeviceTypeId)
            return BadRequest("ID uyuşmuyor.");

        var entity = await context.NewDeviceTypes.FindAsync(id);
        if (entity == null)
            return NotFound();

        entity.DeviceTypeName = dto.DeviceTypeName;
        entity.DeviceTypeComment = dto.DeviceTypeComment;
        entity.ReferenceCalibrator = dto.ReferenceCalibrator;

        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await context.NewDeviceTypes.FindAsync(id);
        if (entity == null)
            return NotFound();

        context.NewDeviceTypes.Remove(entity);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
