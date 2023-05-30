using AutoMapper;
using WebBook.Application.Common.Mappings;
using WebBook.Domain.Entities;

namespace WebBook.Application.Books.Queries.GetBooksWithPagination;
public class BookDto : IMapFrom<Book>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int NumberPages { get; set; }
    public DateTime PublicationDt { get; set; }
    public int CategoryId { get; set; }
    public int AuthorId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public void Mapping(Profile profile)
    {
        var c = profile.CreateMap<Book, BookDto>()
            .ForMember(d => d.Category, opt => opt.MapFrom(s => s.Category.Name))
            .ForMember(d => d.Author, opt => opt.MapFrom(s => s.Author.Name));
    }
}
