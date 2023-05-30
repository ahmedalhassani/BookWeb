using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Borrowers.Commands.DeleteBorrower;

[Authorize(Roles = "Administrator")]
public record DeleteBorrowerCommand(int Id) : IRequest;

public class DeleteBorrowerCommandHandler : IRequestHandler<DeleteBorrowerCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBorrowerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteBorrowerCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Borrowers
            .Where(l => l.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Borrower), request.Id);
        }

        _context.Borrowers.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
