namespace CoreDocu.Application.DTOs.Attachmens
{
    public class AttachmentReadDto
    {
        public string Id { get; set; } = string.Empty;
        public string ArticleId { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string StoredName { get; set; } = string.Empty;
        public long Size { get; set; }
        public string ContentType { get; set; } = string.Empty;
    }
}
