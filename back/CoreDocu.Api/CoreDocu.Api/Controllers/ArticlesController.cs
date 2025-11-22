using CoreDocu.Api.Extensions;
using CoreDocu.Application.DTOs.Articles;
using CoreDocu.Application.DTOs.Sections;
using CoreDocu.Application.Interfaces;
using CoreDocu.Application.Services;
using CoreDocu.Domain.Entities;
using FluentResults;
using Microsoft.AspNetCore.Mvc;
using static System.Collections.Specialized.BitVector32;

namespace CoreDocu.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService service)
        {
            _articleService = service;
        }

        [HttpGet("section/{sectionId}")]
        public async Task<IActionResult> GetBySection(string sectionId)
        {
            var subsections = await _articleService.GetBySectionIdAsync(sectionId);
            return subsections.ToActionResult();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var subSection = await _articleService.GetByIdAsync(id);
            return subSection.ToActionResult();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ArticleCreateDto request)
        {
            var result = await _articleService.CreateAsync(request);
            return result.ToActionResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] ArticleUpdateDto request)
        {
            var result = await _articleService.UpdateAsync(id, request);
            return result.ToActionResult();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _articleService.DeleteAsync(id);
            return result.ToActionResult();
        }

        //LISTAR TODOS LOS ARCHIVOS DE UN ARTICULO
        [HttpGet("{articleId}/attachments")]
        public async Task<IActionResult> GetAttachmentsByArticleId(string articleId)
        {
            var result = await _articleService.GetAttachmentsByArticleIdAsync(articleId);
            return result.ToActionResult();
        }

        //DESCARGAR UN ARCHIVO DE UN ARTICULO
        [HttpGet("{articleId}/attachment/{attachmentId}")]
        public async Task<IActionResult> DownloadAttachment(string articleId, string attachmentId)
        {
            var result = await _articleService.DownloadAttachmentAsync(articleId, attachmentId);
            //return result.ToActionResult();

            if (result.IsFailed)
                return result.ToActionResult();

            var file = result.Value!;

            return File(
                file.FileBytes,
                file.ContentType
                //file.FileName
            );
        }

        //SUBIR UN ARCHIVO A UN ARTIUCLO
        [HttpPost("{articleId}/upload")]
        public async Task<IActionResult> Upload(
            string articleId,
            [FromForm] ArticleUploadCreateDto request)
        {
            var result = await _articleService.UploadAsync(articleId, request);
            return result.ToActionResult();
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<ArticleReorderDto> request)
        {
            var result = await _articleService.ReorderAsync(request);
            return result.ToActionResult();
        }
    }
}
