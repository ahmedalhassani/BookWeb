using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Borrowers.Commands.CreateBorrower;

public record CreateBorrowerCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
}


public class CreateBorrowerCommandHandler : IRequestHandler<CreateBorrowerCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBorrowerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateBorrowerCommand request, CancellationToken cancellationToken)
    {
        var entity = new Borrower
        {
            Name = request.Name,
            Address = request.Address,
            Phone = request.Phone,
        };
        _context.Borrowers.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
