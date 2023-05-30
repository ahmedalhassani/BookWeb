using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Categories.Commands.DeleteCategory;

[Authorize(Roles = "Administrator")]
public record DeleteCategoryCommand(int Id) : IRequest;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Categories
            .Where(l => l.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Category), request.Id);
        }

        _context.Categories.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
