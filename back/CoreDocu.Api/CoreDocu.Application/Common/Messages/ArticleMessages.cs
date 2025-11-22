namespace CoreDocu.Application.Common.Messages
{
    public class ArticleMessages
    {
        // Mensajes de error
        public const string NotFoundArticles= "No existe Artículo(s) con el id especificado.";
        public const string NotFoundArticle= "No existe Artículo con el id especificado.";

        public const string NameAlreadyExists = "Ya existe un artículo con el mismo nombre.";

        // Mensajes de éxito
        public const string Created = "Artículo creado correctamente.";
        public const string Updated = "Artículo actualizado correctamente.";
        public const string Deleted = "Artículo eliminado correctamente.";
    }
}
