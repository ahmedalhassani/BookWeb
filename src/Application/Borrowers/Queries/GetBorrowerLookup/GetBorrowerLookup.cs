using AutoMapper;
using AutoMapper.QueryableExtensions;
using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Security;
using WebBook.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Domain.Entities;
using WebBook.Application.Common.Models;

namespace WebBook.Application.Borrowers.Queries.GetBorrowerLookup;

public record GetBorrowerLookup : IRequest<List<LookupDto>>;

public class GetBorrowerLookupHandler : IRequestHandler<GetBorrowerLookup, List<LookupDto>>
{
    private readonly IApplicationDbContext _context;
    public GetBorrowerLookupHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LookupDto>> Handle(GetBorrowerLookup request, CancellationToken cancellationToken)
    {
        return await _context.Borrowers
                .AsNoTracking()
                .Select(s => new LookupDto { Id = s.Id, Title = s.Name })
                .OrderBy(t => t.Title)
                .ToListAsync(cancellationToken);
    }
}
