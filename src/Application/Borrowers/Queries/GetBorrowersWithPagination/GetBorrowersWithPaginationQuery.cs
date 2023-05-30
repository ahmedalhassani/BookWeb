using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Mappings;
using WebBook.Application.Common.Models;
using MediatR;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using WebBook.Domain.ValueObjects;

namespace WebBook.Application.Borrowers.Queries.GetBorrowersWithPagination;

public record GetBorrowersWithPaginationQuery : IRequest<PaginatedList<BorrowerDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = Constent.pageSize;
}

public class GetBorrowerssWithPaginationQueryHandler : IRequestHandler<GetBorrowersWithPaginationQuery, PaginatedList<BorrowerDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBorrowerssWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BorrowerDto>> Handle(GetBorrowersWithPaginationQuery request, CancellationToken cancellationToken)
    {
        return await _context.Borrowers
            .OrderBy(x => x.Name)
            .ProjectTo<BorrowerDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
    }
}
