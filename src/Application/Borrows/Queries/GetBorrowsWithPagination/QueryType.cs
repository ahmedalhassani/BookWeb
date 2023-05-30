using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebBook.Application.Borrows.Queries.GetBorrowsWithPagination;

public enum QueryType
{
    None = 0,
    Borrows = 1,
    NearExpiry = 2,
    Late = 3,
    Finished = 4
}