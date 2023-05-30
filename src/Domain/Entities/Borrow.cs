using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace WebBook.Domain.Entities;
public class Borrow : BaseAuditableEntity
{
    public int BookId { get; set; }
    public int BorrowerId { get; set; }
    public DateTime? ReplayDt { get; set; }
    public int Duration { get; set; }
    public double Price { get; set; }

    public Book? Book { get; set; }
    public Borrower? Borrower { get; set; }

}
