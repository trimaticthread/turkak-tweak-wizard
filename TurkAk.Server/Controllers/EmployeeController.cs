using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurkAk.Server.Data;
using TurkAk.Server.Models;
using TurkAk.Server.ViewModels;

namespace TurkAk.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController(TurkAkDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var employees = await context.Employees
            .Select(e => new EmployeeDto
            {
                EmployeeId = e.EmployeeId,
                EmployeeNameSurname = e.EmployeeNameSurname,
                EmployeeUserName = e.EmployeeUserName,
                EmployeePassword = "", // Şifreyi döndürme
                EmployeeRole = e.EmployeeRole,
                EmployeeStatus = e.EmployeeStatus
            })
            .ToListAsync();

        return Ok(employees);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var employee = await context.Employees
            .Where(e => e.EmployeeId == id)
            .Select(e => new EmployeeDto
            {
                EmployeeId = e.EmployeeId,
                EmployeeNameSurname = e.EmployeeNameSurname,
                EmployeeUserName = e.EmployeeUserName,
                EmployeePassword = "", // Şifreyi döndürme
                EmployeeRole = e.EmployeeRole,
                EmployeeStatus = e.EmployeeStatus
            })
            .FirstOrDefaultAsync();

        return employee == null ? NotFound() : Ok(employee);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EmployeeDto dto)
    {
        var employee = new Employee
        {
            EmployeeNameSurname = dto.EmployeeNameSurname,
            EmployeeUserName = dto.EmployeeUserName,
            EmployeePassword = BCrypt.Net.BCrypt.HashPassword(dto.EmployeePassword),
            EmployeeRole = dto.EmployeeRole,
            EmployeeStatus = dto.EmployeeStatus
        };

        context.Employees.Add(employee);
        await context.SaveChangesAsync();

        dto.EmployeeId = employee.EmployeeId;
        dto.EmployeePassword = "";
        return CreatedAtAction(nameof(GetById), new { id = dto.EmployeeId }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] EmployeeDto dto)
    {
        if (id != dto.EmployeeId)
            return BadRequest("ID uyuşmuyor.");

        var employee = await context.Employees.FindAsync(id);
        if (employee == null)
            return NotFound();

        employee.EmployeeNameSurname = dto.EmployeeNameSurname;
        employee.EmployeeUserName = dto.EmployeeUserName;

        if (!string.IsNullOrEmpty(dto.EmployeePassword))
            employee.EmployeePassword = BCrypt.Net.BCrypt.HashPassword(dto.EmployeePassword);

        employee.EmployeeRole = dto.EmployeeRole;
        employee.EmployeeStatus = dto.EmployeeStatus;

        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var employee = await context.Employees.FindAsync(id);
        if (employee == null)
            return NotFound();

        context.Employees.Remove(employee);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
