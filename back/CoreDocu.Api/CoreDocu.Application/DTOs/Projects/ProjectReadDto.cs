namespace CoreDocu.Application.DTOs.Projects
{
    public class ProjectReadDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public int Order { get; set; }
    }
}
