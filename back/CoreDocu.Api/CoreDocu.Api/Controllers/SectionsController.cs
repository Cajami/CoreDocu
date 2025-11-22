using CoreDocu.Api.Extensions;
using CoreDocu.Application.DTOs.Sections;
using CoreDocu.Application.Interfaces;
using CoreDocu.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoreDocu.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionsController : ControllerBase
    {
        private readonly ISectionService _sectionService;

        public SectionsController(ISectionService service)
        {
            _sectionService = service;
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetByProjectId(string projectId)
        {
            var sections = await _sectionService.GetByProjectIdAsync(projectId);
            return sections.ToActionResult();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var section = await _sectionService.GetByIdAsync(id);
            return section.ToActionResult();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SectionCreateDto request)
        {
            var result = await _sectionService.CreateAsync(request);
            return result.ToActionResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] SectionUpdateDto request)
        {
            var result = await _sectionService.UpdateAsync(id, request);
            return result.ToActionResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _sectionService.DeleteAsync(id);
            return result.ToActionResult();
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<SectionReorderDto> request)
        {
            var result = await _sectionService.ReorderAsync(request);
            return result.ToActionResult();
        }
    }
}
