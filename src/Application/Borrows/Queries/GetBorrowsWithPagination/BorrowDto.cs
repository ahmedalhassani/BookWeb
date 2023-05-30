using AutoMapper;
using WebBook.Application.Books.Queries.GetBooksWithPagination;
using WebBook.Application.Borrowers.Queries.GetBorrowersWithPagination;
using WebBook.Application.Common.Mappings;
using WebBook.Domain.Entities;

namespace WebBook.Application.Borrows.Queries.GetBorrowsWithPagination;
public class BorrowDto : IMapFrom<Borrow>
{    
    public int Id { get; set; }
    public int BookId { get; set; }
    public int BorrowerId { get; set; }
    public DateTime Created { get; set; }
    public DateTime? ReplayDt { get; set; }
    public int Duration { get; set; }
    public double Price { get; set; }
    public bool IsLate => ReplayDt == null &&  DateTime.UtcNow > DateTime.UtcNow.AddDays(Duration);
    public bool IsNearExpiry => ReplayDt == null && DateTime.UtcNow <= Created.AddDays(Duration) && DateTime.UtcNow.AddDays(2) >= Created.AddDays(Duration);
    public bool Finished => ReplayDt != null;
    public int DayLate => ReplayDt != null? DaysLate(Created.AddDays(Duration), ReplayDt.Value):0;
    public double Fines => DayLate>0?DayLate * 10:0;
    public string Book { get; set; } = string.Empty;
    public BorrowerDto Borrower { get; set; }=new BorrowerDto();
    public void Mapping(Profile profile)
    {
        var c = profile.CreateMap<Borrow, BorrowDto>()
            .ForMember(d => d.Book, opt => opt.MapFrom(s => s.Book!.Name))
            .ForMember(d => d.Borrower, opt => opt.MapFrom(s => s.Borrower));
    }
    int DaysLate(DateTime d1, DateTime d2)
    {
        TimeSpan span = d2.Subtract(d1);
        return (int)span.TotalDays;
    }
}
