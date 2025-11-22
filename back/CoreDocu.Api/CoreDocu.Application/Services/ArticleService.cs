using CoreDocu.Application.Common.Messages;
using CoreDocu.Application.DTOs.Articles;
using CoreDocu.Application.DTOs.Attachmens;
using CoreDocu.Application.Interfaces;
using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Repositories;
using CoreDocu.Infrastructure.Settings;
using FluentResults;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using System.Runtime;
using Attachment = CoreDocu.Domain.Entities.Attachment;

namespace CoreDocu.Application.Services
{
    public class ArticleService : IArticleService
    {
        private readonly ISectionRepository _repositorySection;
        private readonly IArticleRepository _repository;
        private readonly IAttachmentRepository _repositoryAttachment;
        private readonly StorageOptions _storageOptions;
        public ArticleService(
            IArticleRepository repository,
            ISectionRepository section,
            IAttachmentRepository attachment,
            IOptions<StorageOptions> options)
        {
            _repository = repository;
            _repositorySection = section;
            _storageOptions = options.Value;
            _repositoryAttachment = attachment;
        }

        public async Task<Result<IEnumerable<ArticleReadDto>>> GetBySectionIdAsync(string sectionId)
        {
            var articles = await _repository.GetBySectionIdAsync(sectionId);

            if (articles == null)
                return Result.Fail(ArticleMessages.NotFoundArticles);

            var result = articles.Select(p => new ArticleReadDto
            {
                Id = p.Id,
                SectionId = p.SectionId,
                Title = p.Title,
                Content = p.Content,
                Order = p.Order,
            });

            return Result.Ok(result);
        }

        public async Task<Result<ArticleReadDto>> GetByIdAsync(string id)
        {
            var articles = await _repository.GetByIdAsync(id);

            if (articles == null)
                return Result.Fail(ArticleMessages.NotFoundArticle);

            var result = new ArticleReadDto
            {
                Id = articles.Id,
                SectionId = articles.SectionId,
                Title = articles.Title,
                Content = articles.Content,
                Order = articles.Order,
            };

            return Result.Ok(result);
        }

        public async Task<Result<string>> CreateAsync(ArticleCreateDto request)
        {
            //VERIFICAMOS QUE LA SECCION EXISTA
            var section = await _repositorySection.GetByIdAsync(request.SectionId);

            if (section == null)
                return Result.Fail(SectionMessages.NotFoundSecction);

            var article = new Article
            {
                SectionId = request.SectionId,
                Title = request.Title,
                Content = request.Content,
                Order = request.Order,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(article);
            return Result.Ok(article.Id);
        }

        public async Task<Result<string>> UpdateAsync(string id, ArticleUpdateDto request)
        {
            //VALIDAMOS SI EL ARTICULO EXISTE
            var article = await _repository.GetByIdAsync(id);

            if (article == null)
                return Result.Fail(ArticleMessages.NotFoundArticle);

            //ACTUALIZAREMOS SOLO CIERTOS CAMPOS
            var updates = new List<UpdateDefinition<Article>>();

            if (!string.IsNullOrEmpty(request.Title) && request.Title != article.Title)
                updates.Add(Builders<Article>.Update.Set(p => p.Title, request.Title));

            if (!string.IsNullOrEmpty(request.Content) && request.Content != article.Content)
                updates.Add(Builders<Article>.Update.Set(p => p.Content, request.Content));

            if (request.Order > 0 && request.Order != article.Order)
                updates.Add(Builders<Article>.Update.Set(p => p.Order, request.Order));

            updates.Add(Builders<Article>.Update.Set(p => p.UpdatedAt, DateTime.UtcNow));

            var combined = Builders<Article>.Update.Combine(updates);

            //ACTUALIZAMOS EN BD
            await _repository.UpdateFieldsAsync(id, combined);

            return Result.Ok(id).WithSuccess(ArticleMessages.Updated);
        }

        public async Task<Result<string>> DeleteAsync(string id)
        {
            // VALIDAMOS SI LA SUB SECCION EXISTE
            var article = await _repository.GetByIdAsync(id);
            if (article == null)
                return Result.Fail(ArticleMessages.NotFoundArticle);

            await _repository.DeleteAsync(id);

            return Result.Ok(id).WithSuccess(ArticleMessages.Deleted);
        }

        public async Task<Result<IEnumerable<AttachmentReadDto>>> GetAttachmentsByArticleIdAsync(string id)
        {
            var article = await _repository.GetByIdAsync(id);

            if (article == null)
                return Result.Fail(ArticleMessages.NotFoundArticle);

            var attachments = await _repositoryAttachment.GetByArticleIdAsync(article.Id);

            var result = attachments.Select(p => new AttachmentReadDto
            {
                Id = p.Id,
                ArticleId = p.ArticleId,
                FileName = p.FileName,
                StoredName = p.StoredName,
                Size = p.Size,
                ContentType = p.ContentType,
            });

            return Result.Ok(result);
        }

        public async Task<Result<FileDto>> DownloadAttachmentAsync(string articleId, string attachmentId)
        {
            var attachment = await _repositoryAttachment.GetByIdAsync(attachmentId);
            if (attachment is null)
                return Result.Fail(AttachmentMessage.NotFoundAttachment);

            if (attachment.ArticleId != articleId)
                return Result.Fail(ArticleMessages.NotFoundArticle);


            var articleFolder = Path.Combine(_storageOptions.AttachmentsPath, articleId);
            var filePath = Path.Combine(articleFolder, attachment.StoredName);

            if (!File.Exists(filePath))
                return Result.Fail(AttachmentMessage.NotFoundAttachmentDisk);

            var bytes = await File.ReadAllBytesAsync(filePath);

            return Result.Ok(new FileDto
            {
                FileBytes = bytes,
                ContentType = attachment.ContentType,
                FileName = attachment.FileName
            });
        }

        public async Task<Result<string>> UploadAsync(string articleId, ArticleUploadCreateDto request)
        {
            // VALIDAMOS SI EL ARTICULO EXISTE
            var article = await _repository.GetByIdAsync(articleId);
            if (article == null)
                return Result.Fail(ArticleMessages.NotFoundArticle);

            var file = request.File;

            // 2. Crear ID para el attachment
            var attachmentId = ObjectId.GenerateNewId().ToString();
            var storedFileName = $"{attachmentId}{Path.GetExtension(file.FileName)}";

            // 3. Crear carpeta destino si no existe
            var folderPath = Path.Combine(_storageOptions.AttachmentsPath, articleId);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // 4. Guardar archivo físicamente
            var fullPath = Path.Combine(folderPath, storedFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 5. Crear registro del attachment
            var attachment = new Attachment
            {
                Id = attachmentId,
                ArticleId = articleId,
                FileName = file.FileName,
                StoredName = storedFileName,
                Size = file.Length,
                ContentType = file.ContentType,
                CreatedAt = DateTime.UtcNow
            };

            await _repositoryAttachment.CreateAsync(attachment);

            return Result.Ok(attachmentId).WithSuccess(AttachmentMessage.Created);
        }

        public async Task<Result<string>> ReorderAsync(List<ArticleReorderDto> request)
        {
            if (request == null || request.Count == 0)
                return Result.Fail("No se envió información para ordenar.");

            var sectionId = request.First().SectionId;

            // Mandar al repositorio la lista completa
            var requestArticle = request.Select(x => new Article
            {
                Id = x.Id,
                Order = x.Order,
            }).ToList();

            var ok = await _repository.ReorderArticlesAsync(requestArticle, sectionId);

            if (!ok)
                return Result.Fail("Algunos artículos no existen o no pertenecen a la sección.");

            return Result.Ok("Orden actualizado correctamente");
        }


    }
}
