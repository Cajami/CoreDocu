
namespace CoreDocu.Application.DTOs.Articles
{
    public class ArticleReadDto
    {
        public string Id { get; set; } = string.Empty;
        public string SectionId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
