using CoreDocu.Api.Extensions;
using CoreDocu.Application.DTOs.Projects;
using CoreDocu.Application.Interfaces;
using CoreDocu.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CoreDocu.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _projectService.GetAllAsync();
            return result.ToActionResult();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var result = await _projectService.GetByIdAsync(id);
            return result.ToActionResult();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProjectCreateDto request)
        {
            var result = await _projectService.CreateAsync(request);
            return result.ToActionResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] ProjectUpdateDto request)
        {
            var result = await _projectService.UpdateAsync(id, request);
            return result.ToActionResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _projectService.DeleteAsync(id);
            return result.ToActionResult();
        }
    }
}
