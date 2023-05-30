using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebBook.Domain.Entities;
public class Category : BaseAuditableEntity
{
    public string Name { get; set; }=string.Empty;

    public IList<Book>? Books { get; private set; }
}
