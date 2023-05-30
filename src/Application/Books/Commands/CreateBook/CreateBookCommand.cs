using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Books.Commands.CreateBook;

public record CreateBookCommand : IRequest<int>
{
    public string Name { get; init; } = string.Empty;
    public int NumberPages { get; set; }
    public int CategoryId { get; set; }
    public int AuthorId { get; set; }
    public DateTime PublicationDt { get; set; }
}


public class CreateBookCommandHandler : IRequestHandler<CreateBookCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBookCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateBookCommand request, CancellationToken cancellationToken)
    {
        var entity = new Book
        {
            Name = request.Name,
            NumberPages = request.NumberPages,
            PublicationDt = request.PublicationDt,
            CategoryId = request.CategoryId,
            AuthorId = request.AuthorId,
        };
        _context.Books.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}
