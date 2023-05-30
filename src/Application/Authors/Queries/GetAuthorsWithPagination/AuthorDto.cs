using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebBook.Application.Common.Mappings;
using WebBook.Domain.Entities;

namespace WebBook.Application.Authors.Queries.GetAuthorsWithPagination;
public class AuthorDto : IMapFrom<Author>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}
