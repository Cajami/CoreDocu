using CoreDocu.Application.DTOs.Articles;
using CoreDocu.Application.DTOs.Attachmens;
using FluentResults;
using Microsoft.AspNetCore.Http;

namespace CoreDocu.Application.Interfaces
{
    public interface IArticleService
    {
        Task<Result<IEnumerable<ArticleReadDto>>> GetBySectionIdAsync(string sectionId);
        Task<Result<ArticleReadDto>> GetByIdAsync(string id);
        Task<Result<string>> CreateAsync(ArticleCreateDto request);
        Task<Result<string>> UpdateAsync(string id, ArticleUpdateDto request);
        Task<Result<string>> DeleteAsync(string id);
        Task<Result<IEnumerable<AttachmentReadDto>>> GetAttachmentsByArticleIdAsync(string id);
        Task<Result<FileDto>> DownloadAttachmentAsync(string articleId, string attachmentId);
        Task<Result<string>> UploadAsync(string articleId, ArticleUploadCreateDto request);
        Task<Result<string>> ReorderAsync(List<ArticleReorderDto> request);

    }
}
