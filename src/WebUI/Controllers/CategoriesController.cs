using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebBook.Application.Common.Models;
using WebBook.Application.Categories.Queries.GetCategoriessWithPagination;
using WebBook.Application.Categories.Queries.GetCategoryLookup;
using WebBook.Application.Categories.Commands.DeleteCategory;
using WebBook.Application.Categories.Commands.UpdateCategory;
using WebBook.Application.Categories.Commands.CreateCategory;
using WebBook.Application.Borrowers.Queries.GetBorrowerLookup;

namespace WebBook.WebUI.Controllers;
//[Authorize(Roles = "Administrator")]
public class CategoriesController : ApiControllerBase
{

    [HttpGet]
    public async Task<ActionResult<PaginatedList<CategoryDto>>> GetCategoriessWithPagination([FromQuery] GetCategoriessWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("Lookup")]
    public async Task<ActionResult<List<LookupDto>>> GetLookup()
    {
        return await Mediator.Send(new GetCategoryLookup());
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateCategoryCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateCategoryCommand command)
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
        await Mediator.Send(new DeleteCategoryCommand(id));

        return NoContent();
    }
}
