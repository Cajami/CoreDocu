using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Context;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public class AttachmentRepository : IAttachmentRepository
    {
        private readonly MongoDbContext _context;

        public AttachmentRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Attachment>> GetByArticleIdAsync(string articleId)
        {
            return await _context.Attachments.Find(s => s.ArticleId == articleId).ToListAsync();
        }

        public async Task<Attachment?> GetByIdAsync(string id)
        {
            return await _context.Attachments.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Attachment article)
        {
            await _context.Attachments.InsertOneAsync(article);
        }

        public async Task UpdateFieldsAsync(string id, UpdateDefinition<Attachment> updates)
        {
            await _context.Attachments.UpdateOneAsync(
               Builders<Attachment>.Filter.Eq(p => p.Id, id),
               updates
           );
        }

        public async Task DeleteAsync(string id)
        {
            await _context.Articles.DeleteOneAsync(s => s.Id == id);
        }
    }
}
