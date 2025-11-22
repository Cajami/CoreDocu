namespace CoreDocu.Application.DTOs.Attachmens
{
    public class FileDto
    {
        public required byte[] FileBytes { get; set; }
        public required string ContentType { get; set; }
        public required string FileName { get; set; }
    }
}
