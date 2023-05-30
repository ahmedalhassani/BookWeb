using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebBook.Domain.Entities;
public class Author : BaseAuditableEntity
{
    public string Name { get; set; }=string.Empty;
    public string? Address { get; set; }

    public IList<Book> Books { get; private set; } = new List<Book>();
}
