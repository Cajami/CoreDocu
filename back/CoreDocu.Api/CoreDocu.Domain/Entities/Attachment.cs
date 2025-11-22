using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace CoreDocu.Domain.Entities
{
    public class Attachment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("articleId")]
        public string ArticleId { get; set; } = string.Empty;

        [BsonElement("fileName")]
        public string FileName { get; set; } = string.Empty;

        [BsonElement("storedName")]
        public string StoredName { get; set; } = string.Empty;

        [BsonElement("size")]
        public long Size { get; set; }

        [BsonElement("contentType")]
        public string ContentType { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
