using CoreDocu.Application.DTOs.Projects;
using CoreDocu.Domain.Entities;
using FluentResults;

namespace CoreDocu.Application.Interfaces
{
    public interface IProjectService
    {
        Task<Result<IEnumerable<ProjectReadDto>>> GetAllAsync();
        Task<Result<ProjectReadDto>> GetByIdAsync(string id);
        Task<Result<string>> CreateAsync(ProjectCreateDto request);
        Task<Result<string>> UpdateAsync(string id, ProjectUpdateDto request);
        Task<Result<string>> DeleteAsync(string id);
    }
}
