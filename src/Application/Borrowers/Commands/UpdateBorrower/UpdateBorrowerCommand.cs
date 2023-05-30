using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Borrowers.Commands.UpdateBorrower;

public record UpdateBorrowerCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
}

public class UpdateBorrowerCommandHandler : IRequestHandler<UpdateBorrowerCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBorrowerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateBorrowerCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Borrowers
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Borrower), request.Id);
        }

        entity.Name = request.Name;
        entity.Address = request.Address;
        entity.Phone = request.Phone;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
