using Microsoft.AspNetCore.Mvc;
using WebBook.Application.Common.Models;
using WebBook.Application.Borrows.Queries.GetBorrowsWithPagination;
using WebBook.Application.Borrows.Commands.DeleteBorrow;
using WebBook.Application.Borrows.Commands.UpdateBorrow;
using WebBook.Application.Borrows.Commands.CreateBorrow;
using WebBook.Application.Borrows.Queries.GetBorrowQuery;

namespace WebBook.WebUI.Controllers;
public class BorrowsController : ApiControllerBase
{

    [HttpGet]
    public async Task<ActionResult<PaginatedList<BorrowDto>>> GetBorrowsWithPagination([FromQuery] GetBorrowsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }
    [HttpGet("Borrow/{id}")]
    public async Task<ActionResult<BorrowDto>> GetBorrow(int id)
    {
        return await Mediator.Send(new GetBorrowQuery { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult<BorrowDto>> Create(CreateBorrowCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateBorrowCommand command)
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
        await Mediator.Send(new DeleteBorrowCommand(id));

        return NoContent();
    }
}
