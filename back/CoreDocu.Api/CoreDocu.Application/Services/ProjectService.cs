using CoreDocu.Application.Common.Messages;
using CoreDocu.Application.DTOs.Projects;
using CoreDocu.Application.Interfaces;
using CoreDocu.Domain.Entities;
using CoreDocu.Infrastructure.Repositories;
using FluentResults;
using MongoDB.Driver;

namespace CoreDocu.Application.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;

        public ProjectService(IProjectRepository repository)
        {
            _repository = repository;
        }

        public async Task<Result<IEnumerable<ProjectReadDto>>> GetAllAsync()
        {
            var projects = await _repository.GetAllAsync();

            var result = projects.Select(p => new ProjectReadDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
            });

            return Result.Ok(result);
        }

        public async Task<Result<ProjectReadDto>> GetByIdAsync(string id)
        {
            var project = await _repository.GetByIdAsync(id);

            if (project == null)
                return Result.Fail(ProjectMessages.NotFound);

            var result = new ProjectReadDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
            };

            return Result.Ok(result);
        }

        public async Task<Result<string>> CreateAsync(ProjectCreateDto projectDto)
        {
            var project = new Project
            {
                Name = projectDto.Name,
                Description = projectDto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            await _repository.CreateAsync(project);
            return Result.Ok(project.Id);
        }

        public async Task<Result<string>> UpdateAsync(string id, ProjectUpdateDto request)
        {
            //VALIDAMOS SI EL PROJECTO EXISTE
            var project = await _repository.GetByIdAsync(id);
            if (project == null)
                return Result.Fail(ProjectMessages.NotFound);

            //ACTUALIZAREMOS SOLO CIERTOS CAMPOS
            var updates = new List<UpdateDefinition<Project>>();

            if (!string.IsNullOrEmpty(request.Name) && request.Name != project.Name)
                updates.Add(Builders<Project>.Update.Set(p => p.Name, request.Name));

            if (!string.IsNullOrEmpty(request.Description) && request.Description != project.Description)
                updates.Add(Builders<Project>.Update.Set(p => p.Description, request.Description));

            updates.Add(Builders<Project>.Update.Set(p => p.UpdatedAt, DateTime.UtcNow));

            var combined = Builders<Project>.Update.Combine(updates);

            //ACTUALIZAMOS EN BD
            await _repository.UpdateFieldsAsync(id, combined);

            return Result.Ok(id).WithSuccess(ProjectMessages.Updated);
        }

        public async Task<Result<string>> DeleteAsync(string id)
        {
            //VALIDAMOS SI EL PROJECTO EXISTE
            var project = await _repository.GetByIdAsync(id);
            if (project == null)
                return Result.Fail(ProjectMessages.NotFound);

            await _repository.DeleteAsync(id);

            return Result.Ok(id).WithSuccess(ProjectMessages.Deleted);
        }

    }
}
