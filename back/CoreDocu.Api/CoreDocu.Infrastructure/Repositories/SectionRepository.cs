using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Context;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public class SectionRepository : ISectionRepository
    {
        private readonly MongoDbContext _context;

        public SectionRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Section>> GetByProjectIdAsync(string projectId)
        {
            return await _context.Sections.Find(s => s.ProjectId == projectId)
                .SortBy(s => s.Order)
                .ToListAsync();
        }

        public async Task<Section?> GetByIdAsync(string id)
        {
            return await _context.Sections.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Section section)
        {
            await _context.Sections.InsertOneAsync(section);
        }

        public async Task UpdateFieldsAsync(string id, UpdateDefinition<Section> updates)
        {
            await _context.Sections.UpdateOneAsync(
                Builders<Section>.Filter.Eq(p => p.Id, id),
                updates
            );
        }

        public async Task DeleteAsync(string id)
        {
            await _context.Sections.DeleteOneAsync(s => s.Id == id);
        }

        public async Task<bool> ReorderSectionsAsync(List<Section> request, string projectId)
        {
            var sectionIds = request.Select(x => x.Id).ToList();

            // 1. Validar que existan y que pertenezcan al mismo proyecto
            var existing = await _context.Sections
                .Find(x => sectionIds.Contains(x.Id) && x.ProjectId == projectId)
                .ToListAsync();

            if (existing.Count != request.Count)
                return false;

            // 2. Preparar operaciones bulk
            var ops = new List<WriteModel<Section>>();

            foreach (var item in request)
            {
                var filter = Builders<Section>.Filter.Where(
                    x => x.Id == item.Id && x.ProjectId == projectId
                );

                var update = Builders<Section>.Update.Set(x => x.Order, item.Order);

                ops.Add(new UpdateOneModel<Section>(filter, update));
            }

            // 3. Ejecutar bulk en una sola llamada
            var result = await _context.Sections.BulkWriteAsync(ops);

            return result.IsAcknowledged;
        }

    }
}
