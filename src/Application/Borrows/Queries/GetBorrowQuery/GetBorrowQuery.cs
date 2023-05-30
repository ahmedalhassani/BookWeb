using WebBook.Application.Common.Interfaces;
using WebBook.Application.Common.Mappings;
using WebBook.Application.Common.Models;
using MediatR;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using WebBook.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using WebBook.Application.Books.Queries.GetBooksWithPagination;
using WebBook.Application.Borrows.Queries.GetBorrowsWithPagination;
using WebBook.Application.Common.Exceptions;
using WebBook.Domain.Entities;

namespace WebBook.Application.Borrows.Queries.GetBorrowQuery;

public record GetBorrowQuery : IRequest<BorrowDto>
{
    public int Id { get; init; }
}

public class GetBorrowQueryHandler : IRequestHandler<GetBorrowQuery, BorrowDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBorrowQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BorrowDto> Handle(GetBorrowQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Borrows.AsNoTracking().ProjectTo<BorrowDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(s => s.Id == request.Id);
        if (entity == null)
        {
            throw new NotFoundException(nameof(Borrow), request.Id);
        }
        return entity;
    }
}
