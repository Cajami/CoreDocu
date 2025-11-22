using CoreDocu.Application.DTOs.Sections;
using FluentResults;

namespace CoreDocu.Application.Interfaces
{
    public interface ISectionService
    {
        Task<Result<IEnumerable<SectionReadDto>>> GetByProjectIdAsync(string projectId);
        Task<Result<SectionReadDto>> GetByIdAsync(string id);
        Task<Result<string>> CreateAsync(SectionCreateDto request);
        Task<Result<string>> UpdateAsync(string id, SectionUpdateDto request);
        Task<Result<string>> DeleteAsync(string id);
        Task<Result<string>> ReorderAsync(List<SectionReorderDto> request);
    }
}
