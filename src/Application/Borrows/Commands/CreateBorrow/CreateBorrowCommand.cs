using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;
using WebBook.Application.Borrows.Queries.GetBorrowsWithPagination;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace WebBook.Application.Borrows.Commands.CreateBorrow;

public record CreateBorrowCommand : IRequest<BorrowDto>
{
    public int BookId { get; set; }
    public int? BorrowerId { get; set; }
    public int Duration { get; set; }
    public double Price { get; set; }
    public Borrower? Borrower { get; set; }

}


public class CreateBorrowCommandHandler : IRequestHandler<CreateBorrowCommand, BorrowDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateBorrowCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BorrowDto> Handle(CreateBorrowCommand request, CancellationToken cancellationToken)
    {
        var entity = new Borrow
        {
            BookId = request.BookId,
            Duration = request.Duration,
            Price = request.Price
        };
        if(request.BorrowerId != null)
        {
            entity.BorrowerId = request.BorrowerId.Value;
        }else if(request.Borrower != null&& request.Borrower.Name!=null)
        {
            entity.Borrower = request.Borrower;
        }
        _context.Borrows.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return await _context.Borrows.ProjectTo<BorrowDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(s => s.Id == entity.Id);
    }
}
