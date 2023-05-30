using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Books.Commands.DeleteBook;

[Authorize(Roles = "Administrator")]
public record DeleteBookCommand(int Id) : IRequest;

public class DeleteBookCommandHandler : IRequestHandler<DeleteBookCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBookCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteBookCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Books
            .Where(l => l.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Book), request.Id);
        }

        _context.Books.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
