namespace CoreDocu.Infrastructure.Settings
{
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string ProjectsCollection { get; set; } = string.Empty;
        public string SectionsCollection { get; set; } = string.Empty;
        public string ArticlesCollection { get; set; } = string.Empty;
        public string AttachmentsCollection { get; set; } = string.Empty;
    }
}
