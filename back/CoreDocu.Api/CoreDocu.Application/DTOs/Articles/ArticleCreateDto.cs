namespace CoreDocu.Application.DTOs.Articles
{
    public class ArticleCreateDto
    {
        public string SectionId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
