namespace CoreDocu.Application.DTOs.Sections
{
    public class SectionReorderDto
    {
        public string Id { get; set; } = string.Empty;
        public string ProjectId { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
