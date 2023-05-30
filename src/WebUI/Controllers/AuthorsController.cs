using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebBook.Application.Common.Models;
using WebBook.Application.Authors.Queries.GetAuthorsWithPagination;
using WebBook.Application.Authors.Queries.GetAuthorLookup;
using WebBook.Application.Authors.Commands.DeleteAuthor;
using WebBook.Application.Authors.Commands.UpdateAuthor;
using WebBook.Application.Authors.Commands.CreateAuthor;
using WebBook.Application.Categories.Queries.GetCategoryLookup;

namespace WebBook.WebUI.Controllers;
//[Authorize(Roles = "Administrator")]
public class AuthorsController : ApiControllerBase
{

    [HttpGet]
    public async Task<ActionResult<PaginatedList<AuthorDto>>> GetAuthorsWithPagination([FromQuery] GetAuthorsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("Lookup")]
    public async Task<ActionResult<List<LookupDto>>> GetLookup()
    {
        return await Mediator.Send(new GetAuthorLookup());
    }


    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateAuthorCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateAuthorCommand command)
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
        await Mediator.Send(new DeleteAuthorCommand(id));

        return NoContent();
    }
}
