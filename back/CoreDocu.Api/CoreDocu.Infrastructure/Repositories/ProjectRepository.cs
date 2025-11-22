using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Context;
using MongoDB.Driver;

namespace CoreDocu.Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly MongoDbContext _context;

        public ProjectRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Project>> GetAllAsync() =>
            await _context.Projects.Find(_ => true).ToListAsync();

        public async Task<Project?> GetByIdAsync(string id) =>
            await _context.Projects.Find(p => p.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Project project) =>
            await _context.Projects.InsertOneAsync(project);

        public async Task UpdateFieldsAsync(string id, UpdateDefinition<Project> updates)
        {
            await _context.Projects.UpdateOneAsync(
                Builders<Project>.Filter.Eq(p => p.Id, id),
                updates
            );
        }

        public async Task DeleteAsync(string id) =>
            await _context.Projects.DeleteOneAsync(p => p.Id == id);
    }
}
