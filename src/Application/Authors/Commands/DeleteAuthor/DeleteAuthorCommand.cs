using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Authors.Commands.DeleteAuthor;

[Authorize(Roles = "Administrator")]
public record DeleteAuthorCommand(int Id) : IRequest;

public class DeleteAuthorCommandHandler : IRequestHandler<DeleteAuthorCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteAuthorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteAuthorCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Authors
            .Where(l => l.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Author), request.Id);
        }

        _context.Authors.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
