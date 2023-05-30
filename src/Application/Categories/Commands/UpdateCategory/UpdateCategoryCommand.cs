using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Categories.Commands.UpdateCategory;

[Authorize(Roles = "Administrator")]
public record UpdateCategoryCommand : IRequest
{
    public int Id { get; init; }

    public string? Name { get; init; }
}

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Categories
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Category), request.Id);
        }

        entity.Name = request.Name!;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
