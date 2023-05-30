using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Mappings;
using WebBook.Application.Common.Models;
using MediatR;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using WebBook.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using WebBook.Application.Books.Queries.GetBooksWithPagination;

namespace WebBook.Application.Borrows.Queries.GetBorrowsWithPagination;

public record GetBorrowsWithPaginationQuery : IRequest<PaginatedList<BorrowDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = Constent.pageSize;
    public QueryType Type { get; init; }
    public int? BookId { get; set; }
    public int? BorrowerId { get; set; }
    public DateTime? Created { get; set; }
    public DateTime? ReplayDt { get; set; }
    public int? Duration { get; set; }
    public double? Price { get; set; }

}

public class GetBorrowssWithPaginationQueryHandler : IRequestHandler<GetBorrowsWithPaginationQuery, PaginatedList<BorrowDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBorrowssWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BorrowDto>> Handle(GetBorrowsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var toDay = DateTime.UtcNow.Date;
        var query = _context.Borrows
                  .OrderBy(x => x.Book!.Name)
                  .Include(s => s.Book)
                  .Include(s => s.Borrower)
                  .AsQueryable();
        switch (request.Type)
        {
            case QueryType.Borrows:
                query = query.Where(s => s.ReplayDt == null);
                break;
            case QueryType.NearExpiry:
                query = query.Where(s => s.ReplayDt == null && toDay <= s.Created.AddDays(s.Duration).Date && toDay.AddDays(2) >= s.Created.AddDays(s.Duration).Date);
                break;
            case QueryType.Late:
                query = query.Where(s => s.ReplayDt == null && toDay > s.Created.AddDays(s.Duration).Date);
                break;
            case QueryType.Finished:
                query = query.Where(s => s.ReplayDt != null);
                break;
            default:
                break;
        }
        if (request.BookId > 0)
        {
            query = query.Where(s => s.BookId == request.BookId);
        }
        if (request.BorrowerId > 0)
        {
            query = query.Where(s => s.BorrowerId == request.BorrowerId);
        }      
        if (request.Created.HasValue)
        {
            query = query.Where(s => s.Created.Date == request.Created.Value.Date);
        }
        if (request.ReplayDt.HasValue)
        {
            query = query.Where(s => s.ReplayDt == request.ReplayDt);
        }
        if (request.Duration > 0)
        {
            query = query.Where(s => s.Duration == request.Duration);
        }
        if (request.Price > 0)
        {
            query = query.Where(s => s.Price == request.Price);
        }
        return await query.ProjectTo<BorrowDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
    }
}
