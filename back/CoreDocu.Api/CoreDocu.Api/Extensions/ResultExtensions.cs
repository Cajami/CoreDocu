using FluentResults;
using Microsoft.AspNetCore.Mvc;

namespace CoreDocu.Api.Extensions
{
    public static class ResultExtensions
    {
        public static IActionResult ToActionResult<T>(this Result<T> result)
        {
            if (result.IsFailed)
                return new BadRequestObjectResult(new { success = false, errors = result.Errors.Select(e => e.Message) });

            return new OkObjectResult(new { success = true, data = result.Value });
        }
    }
}
