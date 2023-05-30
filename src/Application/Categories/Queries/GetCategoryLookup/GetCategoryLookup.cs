using AutoMapper;
using AutoMapper.QueryableExtensions;
using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Security;
using WebBook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Domain.Entities;
using WebBook.Application.Common.Models;

namespace WebBook.Application.Categories.Queries.GetCategoryLookup;

public record GetCategoryLookup : IRequest<List<LookupDto>>;

public class GetCategoryLookupHandler : IRequestHandler<GetCategoryLookup, List<LookupDto>>
{
    private readonly IApplicationDbContext _context;
    public GetCategoryLookupHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LookupDto>> Handle(GetCategoryLookup request, CancellationToken cancellationToken)
    {
        return await _context.Categories
                .AsNoTracking()
                .Select(s=> new LookupDto {Id=s.Id,Title=s.Name })
                .OrderBy(t => t.Title)
                .ToListAsync(cancellationToken);
    }
}
