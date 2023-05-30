using FluentValidation;

namespace WebBook.Application.Authors.Queries.GetAuthorsWithPagination;

public class GetAuthorsWithPaginationQueryValidator : AbstractValidator<GetAuthorsWithPaginationQuery>
{
    public GetAuthorsWithPaginationQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber at least greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1).WithMessage("PageSize at least greater than or equal to 1.");
    }
}
