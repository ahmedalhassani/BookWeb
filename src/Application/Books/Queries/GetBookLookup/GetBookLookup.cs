using AutoMapper;
using AutoMapper.QueryableExtensions;
using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Security;
using WebBook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Domain.Entities;
using WebBook.Application.Common.Models;

namespace WebBook.Application.Books.Queries.GetBookLookup;

public record GetBookLookup : IRequest<List<LookupDto>>;

public class GetBookLookupHandler : IRequestHandler<GetBookLookup, List<LookupDto>>
{
    private readonly IApplicationDbContext _context;

    public GetBookLookupHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LookupDto>> Handle(GetBookLookup request, CancellationToken cancellationToken)
    {
        return await _context.Books
                .AsNoTracking()
                .Select(s => new LookupDto { Id = s.Id, Title = s.Name })
                .OrderBy(t => t.Title)
                .ToListAsync(cancellationToken);
    }
}
