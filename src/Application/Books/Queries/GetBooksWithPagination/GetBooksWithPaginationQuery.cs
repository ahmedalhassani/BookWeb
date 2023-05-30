using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Mappings;
using WebBook.Application.Common.Models;
using MediatR;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using WebBook.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace WebBook.Application.Books.Queries.GetBooksWithPagination;

public record GetBooksWithPaginationQuery : IRequest<PaginatedList<BookDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = Constent.pageSize;
    public string? Name { get; set; }
    public DateTime? PublicationDt { get; set; }
    public int? CategoryId { get; set; }
    public int? AuthorId { get; set; }
}

public class GetBookssWithPaginationQueryHandler : IRequestHandler<GetBooksWithPaginationQuery, PaginatedList<BookDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBookssWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BookDto>> Handle(GetBooksWithPaginationQuery request, CancellationToken cancellationToken)
    {
       var query= _context.Books
            .OrderBy(x => x.Name)
            .Include(s => s.Category)
            .Include(s => s.Author).AsQueryable();
        if(!string.IsNullOrEmpty(request.Name)) {
            query = query.Where(s => s.Name.Contains(request.Name));
        }
        if(request.PublicationDt.HasValue) {
            query = query.Where(s => s.PublicationDt.Date == request.PublicationDt.Value.Date);
        }
        if(request.CategoryId>0) {
            query = query.Where(s => s.CategoryId == request.CategoryId);
        }
        if(request.AuthorId>0) {
            query = query.Where(s => s.AuthorId == request.AuthorId);
        }
        return await query.ProjectTo<BookDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
    }
}
