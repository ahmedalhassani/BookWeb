using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebBook.Application.Common.Mappings;
using WebBook.Domain.Entities;

namespace WebBook.Application.Categories.Queries.GetCategoriessWithPagination;
public class CategoryDto : IMapFrom<Category>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
