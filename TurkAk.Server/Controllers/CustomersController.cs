using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurkAk.Server.Data;
using TurkAk.Server.Models;
using TurkAk.Server.ViewModels;

namespace TurkAk.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController(TurkAkDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var customers = await context.Customers
            .Select(c => new CustomerDto
            {
                CustomersId = c.CustomersId,
                Title = c.Title,
                TaxNumber = c.TaxNumber,
                BrandInfo = c.BrandInfo,
                CustomersAddress = c.CustomersAddress,
                PhoneNumber = c.PhoneNumber,
                Email = c.Email,
                Website = c.Website,
                Country = c.Country,
                City = c.City,
                Files = c.Files,
                AccountType = c.AccountType
            })
            .ToListAsync();

        return Ok(customers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var customer = await context.Customers
            .Where(c => c.CustomersId == id)
            .Select(c => new CustomerDto
            {
                CustomersId = c.CustomersId,
                Title = c.Title,
                TaxNumber = c.TaxNumber,
                BrandInfo = c.BrandInfo,
                CustomersAddress = c.CustomersAddress,
                PhoneNumber = c.PhoneNumber,
                Email = c.Email,
                Website = c.Website,
                Country = c.Country,
                City = c.City,
                Files = c.Files,
                AccountType = c.AccountType
            })
            .FirstOrDefaultAsync();

        return customer == null ? NotFound() : Ok(customer);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CustomerDto dto)
    {
        var customer = new Customer
        {
            Title = dto.Title,
            TaxNumber = dto.TaxNumber,
            BrandInfo = dto.BrandInfo,
            CustomersAddress = dto.CustomersAddress,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Website = dto.Website,
            Country = dto.Country,
            City = dto.City,
            Files = dto.Files,
            AccountType = dto.AccountType
        };

        context.Customers.Add(customer);
        await context.SaveChangesAsync();

        dto.CustomersId = customer.CustomersId;
        return CreatedAtAction(nameof(GetById), new { id = dto.CustomersId }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CustomerDto dto)
    {
        if (id != dto.CustomersId)
            return BadRequest("ID uyuşmuyor.");

        var customer = await context.Customers.FindAsync(id);
        if (customer == null)
            return NotFound();

        customer.Title = dto.Title;
        customer.TaxNumber = dto.TaxNumber;
        customer.BrandInfo = dto.BrandInfo;
        customer.CustomersAddress = dto.CustomersAddress;
        customer.PhoneNumber = dto.PhoneNumber;
        customer.Email = dto.Email;
        customer.Website = dto.Website;
        customer.Country = dto.Country;
        customer.City = dto.City;
        customer.Files = dto.Files;
        customer.AccountType = dto.AccountType;

        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer == null)
            return NotFound();

        context.Customers.Remove(customer);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
