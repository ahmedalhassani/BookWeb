using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace WebBook.Domain.Entities;
public class Borrower : BaseAuditableEntity
{
    public string Name { get; set; }=string.Empty;
    public string Address { get; set; }=string.Empty;
    public string Phone { get; set; }=string.Empty;

    public IList<Borrow>? Borrows { get; private set; }

}
