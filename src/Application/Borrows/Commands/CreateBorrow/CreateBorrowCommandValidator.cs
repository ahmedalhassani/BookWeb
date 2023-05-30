using WebBook.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace WebBook.Application.Borrows.Commands.CreateBorrow;

public class CreateBorrowCommandValidator : AbstractValidator<CreateBorrowCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateBorrowCommandValidator(IApplicationDbContext context)
    {
        _context = context;
        RuleFor(v => v.BookId)
            .NotEmpty().WithMessage("Book Id is required.");
        RuleFor(v => v.Duration)
            .NotEmpty().WithMessage("Duration is required.");
        RuleFor(v => v.Price)
            .NotEmpty().WithMessage("Price is required.");
    }

}
