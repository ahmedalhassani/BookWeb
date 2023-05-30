using Microsoft.AspNetCore.Mvc;
using WebBook.Application.Common.Models;
using WebBook.Application.Borrowers.Queries.GetBorrowersWithPagination;
using WebBook.Application.Borrowers.Queries.GetBorrowerLookup;
using WebBook.Application.Borrowers.Commands.DeleteBorrower;
using WebBook.Application.Borrowers.Commands.UpdateBorrower;
using WebBook.Application.Borrowers.Commands.CreateBorrower;
using WebBook.Application.Books.Queries.GetBookLookup;

namespace WebBook.WebUI.Controllers;
public class BorrowersController : ApiControllerBase
{

    [HttpGet]
    public async Task<ActionResult<PaginatedList<BorrowerDto>>> GetBorrowersWithPagination([FromQuery] GetBorrowersWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("Lookup")]
    public async Task<ActionResult<List<LookupDto>>> GetLookup()
    {
        return await Mediator.Send(new GetBorrowerLookup());
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateBorrowerCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateBorrowerCommand command)
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
        await Mediator.Send(new DeleteBorrowerCommand(id));

        return NoContent();
    }
}
