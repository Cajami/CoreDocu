namespace CoreDocu.Application.Common.Messages
{
    public class AttachmentMessage
    {
        // Mensajes de error
        public const string NotFoundAttachments = "No existe Archivos(s) con el id especificado.";
        public const string NotFoundAttachment = "No existe Archivo con el id especificado.";
        public const string NotFoundAttachmentDisk = "No existe Archivo con el id especificado en disco";

        // Mensajes de éxito
        public const string Created = "Archivo creado correctamente.";
        public const string Updated = "Archivo actualizado correctamente.";
        public const string Deleted = "Archivo eliminado correctamente.";
        public const string UploadCreated = "Archivo guardado correctamente al Artículo.";
    }
}
