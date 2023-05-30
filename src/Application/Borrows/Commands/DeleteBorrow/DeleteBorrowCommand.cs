using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Borrows.Commands.DeleteBorrow;

[Authorize(Roles = "Administrator")]
public record DeleteBorrowCommand(int Id) : IRequest;

public class DeleteBorrowCommandHandler : IRequestHandler<DeleteBorrowCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBorrowCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteBorrowCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Borrows
            .Where(l => l.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Borrow), request.Id);
        }

        _context.Borrows.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
