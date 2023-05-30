using WebBook.Application.Common.Exceptions;
using WebBook.Application.Common.Interfaces;
using WebBook.Domain.Entities;
using MediatR;
using WebBook.Application.Common.Security;

namespace WebBook.Application.Books.Commands.UpdateBook;

public record UpdateBookCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public int NumberPages { get; set; }
    public int CategoryId { get; set; }
    public int AuthorId { get; set; }
    public DateTime PublicationDt { get; set; }
}

public class UpdateBookCommandHandler : IRequestHandler<UpdateBookCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBookCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateBookCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Books
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(Book), request.Id);
        }

        entity.Name = request.Name;
        entity.NumberPages = request.NumberPages;
        entity.CategoryId = request.CategoryId;
        entity.AuthorId = request.AuthorId;
        entity.PublicationDt = request.PublicationDt;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
