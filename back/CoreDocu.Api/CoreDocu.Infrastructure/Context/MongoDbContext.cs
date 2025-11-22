using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using static System.Collections.Specialized.BitVector32;

namespace CoreDocu.Infrastructure.Context
{
    public class  MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly DatabaseSettings _settings;

        public MongoDbContext(IOptions<DatabaseSettings> options)
        {
            _settings = options.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);

        }

        public IMongoCollection<Project> Projects =>
            _database.GetCollection<Project>(_settings.ProjectsCollection);

        public IMongoCollection<Domain.Entities.Section> Sections =>
            _database.GetCollection<Domain.Entities.Section>(_settings.SectionsCollection);

        public IMongoCollection<Article> Articles =>
            _database.GetCollection<Article>(_settings.ArticlesCollection);

        public IMongoCollection<Attachment> Attachments =>
            _database.GetCollection<Attachment>(_settings.AttachmentsCollection);
    }
}
