using WebBook.Application.Common.Mappings;
using WebBook.Domain.Entities;

namespace WebBook.Application.Borrowers.Queries.GetBorrowersWithPagination;
public class BorrowerDto : IMapFrom<Borrower>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
