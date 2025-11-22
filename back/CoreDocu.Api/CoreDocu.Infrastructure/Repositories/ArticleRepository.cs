
using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Context;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly MongoDbContext _context;

        public ArticleRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Article>> GetBySectionIdAsync(string sectionId)
        {
            return await _context.Articles.Find(s => s.SectionId == sectionId)
                .SortBy(s => s.Order)
                .ToListAsync();
        }

        public async Task<Article?> GetByIdAsync(string id)
        {
            return await _context.Articles.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Article article)
        {
            await _context.Articles.InsertOneAsync(article);
        }

        public async Task UpdateFieldsAsync(string id, UpdateDefinition<Article> updates)
        {
            await _context.Articles.UpdateOneAsync(
               Builders<Article>.Filter.Eq(p => p.Id, id),
               updates
           );
        }

        public async Task DeleteAsync(string id)
        {
            await _context.Articles.DeleteOneAsync(s => s.Id == id);
        }

        public async Task<bool> ReorderArticlesAsync(List<Article> request, string sectionId)
        {
            var articleIds = request.Select(x => x.Id).ToList();

            // 1. Validar que existan y que pertenezcan a la misma sección
            var existing = await _context.Articles
                .Find(x => articleIds.Contains(x.Id) && x.SectionId == sectionId)
                .ToListAsync();

            if (existing.Count != request.Count)
                return false;

            // 2. Preparar operaciones bulk
            var ops = new List<WriteModel<Article>>();

            foreach (var item in request)
            {
                var filter = Builders<Article>.Filter.Where(
                    x => x.Id == item.Id && x.SectionId == sectionId
                );

                var update = Builders<Article>.Update.Set(x => x.Order, item.Order);

                ops.Add(new UpdateOneModel<Article>(filter, update));
            }

            // 3. Ejecutar bulk en una sola llamada
            var result = await _context.Articles.BulkWriteAsync(ops);

            return result.IsAcknowledged;
        }


    }
}
