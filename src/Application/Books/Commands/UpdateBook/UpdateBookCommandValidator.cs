using WebBook.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace WebBook.Application.Books.Commands.UpdateBook;

public class UpdateBookCommandValidator : AbstractValidator<UpdateBookCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBookCommandValidator(IApplicationDbContext context)
    {
        _context = context;
        RuleFor(v => v.Id)
         .NotEmpty().WithMessage("Id is required.");
        RuleFor(v => v.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.")
            .MustAsync(BeUniqueName).WithMessage("The specified name already exists.");
        RuleFor(v => v.NumberPages)
            .NotEmpty().WithMessage("NumberPages is required.");
        RuleFor(v => v.PublicationDt)
            .NotEmpty().WithMessage("Publication is required.");
        RuleFor(v => v.CategoryId)
            .NotEmpty().WithMessage("CategoryId is required.");
        RuleFor(v => v.AuthorId)
            .NotEmpty().WithMessage("AuthorId is required.");
    }

    public async Task<bool> BeUniqueName(UpdateBookCommand model, string Name, CancellationToken cancellationToken)
    {
        return await _context.Books
            .Where(l => l.Id != model.Id)
            .AllAsync(l => l.Name != Name, cancellationToken);
    }
}
