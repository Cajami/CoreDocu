namespace CoreDocu.Application.DTOs.Sections
{
    public class SectionCreateDto
    {
        public string ProjectId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int Order { get; set; }

    }
}
