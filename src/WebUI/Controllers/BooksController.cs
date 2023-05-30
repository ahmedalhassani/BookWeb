using Microsoft.AspNetCore.Mvc;
using WebBook.Application.Common.Models;
using WebBook.Application.Books.Queries.GetBooksWithPagination;
using WebBook.Application.Books.Queries.GetBookLookup;
using WebBook.Application.Books.Commands.DeleteBook;
using WebBook.Application.Books.Commands.UpdateBook;
using WebBook.Application.Books.Commands.CreateBook;
using System.Collections.Generic;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace WebBook.WebUI.Controllers;
public class BooksController : ApiControllerBase
{

    [HttpGet]
    public async Task<ActionResult<PaginatedList<BookDto>>> GetBooksWithPagination([FromQuery] GetBooksWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("Lookup")]
    public async Task<ActionResult<List<LookupDto>>> GetLookup()
    {
        return await Mediator.Send(new GetBookLookup());
    }


    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateBookCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateBookCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteBookCommand(id));

        return NoContent();
    }
}
