using CoreDocu.Domain.Entities;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public interface IProjectRepository
    {
        Task<IEnumerable<Project>> GetAllAsync();
        Task<Project?> GetByIdAsync(string id);
        Task CreateAsync(Project project);
        Task UpdateFieldsAsync(string id, UpdateDefinition<Project> updates);
        Task DeleteAsync(string id);
    }
}
