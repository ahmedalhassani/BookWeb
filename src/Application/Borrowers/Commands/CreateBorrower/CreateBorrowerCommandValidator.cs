

using WebBook.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
namespace WebBook.Application.Borrowers.Commands.CreateBorrower;

public class CreateBorrowerCommandValidator : AbstractValidator<CreateBorrowerCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateBorrowerCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.")
            .MustAsync(BeUniqueName).WithMessage("The specified Name already exists.");
        RuleFor(v => v.Address)
            .NotEmpty().WithMessage("Address is required.")
            .MaximumLength(200).WithMessage("Address must not exceed 200 characters.");
        RuleFor(v => v.Phone)
            .NotEmpty().WithMessage("Phone is required.")
            .MaximumLength(200).WithMessage("Phone must not exceed 200 characters.");
    }

    public async Task<bool> BeUniqueName(string Name, CancellationToken cancellationToken)
    {
        return await _context.Borrowers
            .AllAsync(l => l.Name != Name, cancellationToken);
    }
}
