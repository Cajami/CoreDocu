using Microsoft.AspNetCore.Http;

namespace CoreDocu.Application.DTOs.Articles
{
    public class ArticleUploadCreateDto
    {
        public required IFormFile File { get; set; }
    }
}
