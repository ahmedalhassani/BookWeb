using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Authors.Commands.CreateAuthor;

[Authorize(Roles = "Administrator")]
public record CreateAuthorCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
}

public class CreateAuthorCommandHandler : IRequestHandler<CreateAuthorCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateAuthorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateAuthorCommand request, CancellationToken cancellationToken)
    {
        var entity = new Author
        {
            Name = request.Name,
            Address = request.Address
        };
        _context.Authors.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
