using CoreDocu.Application.Common.Messages;
using CoreDocu.Application.DTOs.Projects;
using CoreDocu.Application.DTOs.Sections;
using CoreDocu.Application.Interfaces;
using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Repositories;
using FluentResults;
using MongoDB.Driver;

namespace CoreDocu.Application.Services
{
    public class SectionService : ISectionService
    {
        private readonly ISectionRepository _repository;

        public SectionService(ISectionRepository repository)
        {
            _repository = repository;
        }

        public async Task<Result<IEnumerable<SectionReadDto>>> GetByProjectIdAsync(string projectId)
        {
            var sections = await _repository.GetByProjectIdAsync(projectId);

            if (sections == null)
                return Result.Fail(SectionMessages.NotFoundSecctions);

            var result = sections.Select(p => new SectionReadDto
            {
                Id = p.Id,
                ProjectId = p.ProjectId,
                Title = p.Title,
                Order = p.Order,
            });

            return Result.Ok(result);
        }

        public async Task<Result<SectionReadDto>> GetByIdAsync(string id)
        {
            var section = await _repository.GetByIdAsync(id);

            if (section == null)
                return Result.Fail(SectionMessages.NotFoundSecction);

            var result = new SectionReadDto
            {
                Id = section.Id,
                ProjectId = section.ProjectId,
                Title = section.Title,
                Order = section.Order,
            };

            return Result.Ok(result);
        }

        public async Task<Result<string>> CreateAsync(SectionCreateDto request)
        {
            var section = new Section
            {
                ProjectId = request.ProjectId,
                Title = request.Title,
                Order = request.Order,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(section);
            return Result.Ok(section.Id);
        }

        public async Task<Result<string>> UpdateAsync(string id, SectionUpdateDto request)
        {
            //VALIDAMOS SI LA SECCIÓN EXISTE
            var section = await _repository.GetByIdAsync(id);

            if (section == null)
                return Result.Fail(SectionMessages.NotFoundSecction);

            //ACTUALIZAREMOS SOLO CIERTOS CAMPOS
            var updates = new List<UpdateDefinition<Section>>();

            if (!string.IsNullOrEmpty(request.Title) && request.Title != section.Title)
                updates.Add(Builders<Section>.Update.Set(p => p.Title, request.Title));

            updates.Add(Builders<Section>.Update.Set(p => p.UpdatedAt, DateTime.UtcNow));

            var combined = Builders<Section>.Update.Combine(updates);

            //ACTUALIZAMOS EN BD
            await _repository.UpdateFieldsAsync(id, combined);

            return Result.Ok(id).WithSuccess(SectionMessages.Updated);
        }

        public async Task<Result<string>> DeleteAsync(string id)
        {
            //VALIDAMOS SI LA SECCION EXISTE
            var section = await _repository.GetByIdAsync(id);
            if (section == null)
                return Result.Fail(SectionMessages.NotFoundSecction);

            await _repository.DeleteAsync(id);

            return Result.Ok(id).WithSuccess(SectionMessages.Deleted);
        }

        public async Task<Result<string>> ReorderAsync(List<SectionReorderDto> request)
        {
            if (request == null || request.Count == 0)
                return Result.Fail("No se envió información para ordenar.");

            var projectId = request.First().ProjectId;

            // Mandar al repositorio la lista completa
            var requestSection = request.Select(x => new Section
            {
                Id = x.Id,
                Order = x.Order,
            }).ToList();

            var ok = await _repository.ReorderSectionsAsync(requestSection, projectId);

            if (!ok)
                return Result.Fail("Algunas secciones no existen o no pertenecen al proyecto.");

            return Result.Ok("Orden actualizado correctamente");
        }


    }
}
