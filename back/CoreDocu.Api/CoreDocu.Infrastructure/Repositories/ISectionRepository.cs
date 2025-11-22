using CoreDocu.Domain.Entities;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public interface ISectionRepository
    {
        Task<IEnumerable<Section>> GetByProjectIdAsync(string projectId);
        Task<Section?> GetByIdAsync(string id);
        Task CreateAsync(Section section);
        Task UpdateFieldsAsync(string id, UpdateDefinition<Section> updates);
        Task DeleteAsync(string id);
        Task<bool> ReorderSectionsAsync(List<Section> sectionIds, string projectId);

    }
}
