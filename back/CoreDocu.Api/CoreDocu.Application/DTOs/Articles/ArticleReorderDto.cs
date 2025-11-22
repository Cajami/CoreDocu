namespace CoreDocu.Application.DTOs.Articles
{
    public class ArticleReorderDto
    {
        public string Id { get; set; } = string.Empty;
        public string SectionId { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
