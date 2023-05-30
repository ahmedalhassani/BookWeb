using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebBook.Domain.Entities;
public class Book : BaseAuditableEntity
{
    public string Name { get; set; }=string.Empty;
    public int NumberPages { get; set; }
    public int CategoryId { get; set; }
    public int AuthorId { get; set; }
    public DateTime PublicationDt { get; set; }

    public Category? Category { get; set; }
    public Author? Author { get; set; }

    public IList<Borrow>? Borrows { get; private set; }
}


