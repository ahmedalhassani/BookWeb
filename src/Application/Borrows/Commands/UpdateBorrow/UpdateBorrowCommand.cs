using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Borrows.Queries.GetBorrowsWithPagination;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace WebBook.Application.Borrows.Commands.UpdateBorrow;

public record UpdateBorrowCommand : IRequest<int>
{
    public int Id { get; init; }
    public int? Duration { get; set; }
    public double? Price { get; set; }
    public DateTime? ReplayDt { get; set; }
}

public class UpdateBorrowCommandHandler : IRequestHandler<UpdateBorrowCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateBorrowCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<int> Handle(UpdateBorrowCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Borrows
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Borrow), request.Id);
        }
        if(request.Duration>0)
        {
           entity.Duration = request.Duration.Value;
        }
        if(request.Price > 0)
        {
           entity.Price = request.Price.Value;
        }
        if(request.ReplayDt.HasValue && request.ReplayDt>entity.Created)
        {
           entity.ReplayDt = request.ReplayDt.Value;
        }
        await _context.SaveChangesAsync(cancellationToken);
        return request.Id;
    }
}
