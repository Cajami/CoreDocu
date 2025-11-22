namespace CoreDocu.Application.DTOs.Articles
{
    public class ArticleUpdateDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int Order { get; set; }
    }
}
