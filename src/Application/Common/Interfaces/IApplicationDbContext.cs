using WebBook.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace WebBook.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }

    DbSet<TodoItem> TodoItems { get; }
    DbSet<Category> Categories { get; }
    DbSet<Author> Authors { get; }
    DbSet<Book> Books { get; }
    DbSet<Borrower> Borrowers { get; }
    DbSet<Borrow> Borrows { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
