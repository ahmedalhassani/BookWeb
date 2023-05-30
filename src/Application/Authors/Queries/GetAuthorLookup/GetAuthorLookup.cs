using AutoMapper;
using AutoMapper.QueryableExtensions;
using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Security;
using WebBook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Domain.Entities;
using WebBook.Application.Common.Models;

namespace WebBook.Application.Authors.Queries.GetAuthorLookup;

public record GetAuthorLookup : IRequest<List<LookupDto>>;

public class GetAuthorLookupHandler : IRequestHandler<GetAuthorLookup, List<LookupDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAuthorLookupHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LookupDto>> Handle(GetAuthorLookup request, CancellationToken cancellationToken)
    {
        return await _context.Authors
                .AsNoTracking()
                .Select(s => new LookupDto { Id = s.Id, Title = s.Name })
                .OrderBy(t => t.Title)
                .ToListAsync(cancellationToken);
    }
}
