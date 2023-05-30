using WebBook.Application.TodoLists.Queries.ExportTodos;

namespace WebBook.Application.Common.Interfaces;

public interface ICsvFileBuilder
{
    byte[] BuildTodoItemsFile(IEnumerable<TodoItemRecord> records);
}
