namespace CoreDocu.Application.DTOs.Sections
{
    public class SectionReadDto
    {
        public string Id { get; set; } = string.Empty;
        public string ProjectId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
