using WebBook.Application.Common.Mappings;
using WebBook.Domain.Entities;

namespace WebBook.Application.TodoLists.Queries.ExportTodos;

public class TodoItemRecord : IMapFrom<TodoItem>
{
    public string? Title { get; set; }

    public bool Done { get; set; }
}
