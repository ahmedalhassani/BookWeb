using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Authors.Commands.UpdateAuthor;

public record UpdateAuthorCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}

public class UpdateAuthorCommandHandler : IRequestHandler<UpdateAuthorCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateAuthorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateAuthorCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Authors
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Author), request.Id);
        }

        entity.Name = request.Name;
        entity.Address = request.Address;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
