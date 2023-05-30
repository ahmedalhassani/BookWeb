using FluentValidation;

namespace WebBook.Application.Books.Queries.GetBooksWithPagination;

public class GetBooksWithPaginationQueryValidator : AbstractValidator<GetBooksWithPaginationQuery>
{
    public GetBooksWithPaginationQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber at least greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1).WithMessage("PageSize at least greater than or equal to 1.");
    }
}
