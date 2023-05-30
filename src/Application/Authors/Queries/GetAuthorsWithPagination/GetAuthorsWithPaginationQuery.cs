using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Mappings;
using WebBook.Application.Common.Models;
using MediatR;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using WebBook.Domain.ValueObjects;

namespace WebBook.Application.Authors.Queries.GetAuthorsWithPagination;

public record GetAuthorsWithPaginationQuery : IRequest<PaginatedList<AuthorDto>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = Constent.pageSize;
}

public class GetAuthorssWithPaginationQueryHandler : IRequestHandler<GetAuthorsWithPaginationQuery, PaginatedList<AuthorDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAuthorssWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<AuthorDto>> Handle(GetAuthorsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        return await _context.Authors
            .OrderBy(x => x.Name)
            .ProjectTo<AuthorDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);
    }
}
