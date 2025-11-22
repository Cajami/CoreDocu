
using CoreDocu.Domain.Entities;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public interface IArticleRepository
    {
        Task<IEnumerable<Article>> GetBySectionIdAsync(string sectionId);
        Task<Article?> GetByIdAsync(string id);
        Task CreateAsync(Article article);
        Task UpdateFieldsAsync(string id, UpdateDefinition<Article> updates);
        Task DeleteAsync(string id);
        Task<bool> ReorderArticlesAsync(List<Article> request, string sectionId);

    }
}
