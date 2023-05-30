using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Mappings;
using WebBook.Application.Common.Models;
using MediatR;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using WebBook.Domain.ValueObjects;

namespace WebBook.Application.Categories.Queries.GetCategoriessWithPagination;

public record GetCategoriessWithPaginationQuery : IRequest<PaginatedList<CategoryDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = Constent.pageSize;
}

public class GetCategoriessWithPaginationQueryHandler : IRequestHandler<GetCategoriessWithPaginationQuery, PaginatedList<CategoryDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCategoriessWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<CategoryDto>> Handle(GetCategoriessWithPaginationQuery request, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .OrderBy(x => x.Name)
            .ProjectTo<CategoryDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
    }
}
