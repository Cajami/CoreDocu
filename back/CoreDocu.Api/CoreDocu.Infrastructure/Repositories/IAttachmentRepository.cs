using CoreDocu.Domain.Entities;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public interface IAttachmentRepository
    {
        Task<IEnumerable<Attachment>> GetByArticleIdAsync(string articleId);
        Task<Attachment?> GetByIdAsync(string id);
        Task CreateAsync(Attachment attachment);
        Task UpdateFieldsAsync(string id, UpdateDefinition<Attachment> updates);
        Task DeleteAsync(string id);
    }
}
