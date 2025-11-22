// Extensiones válidas
export const VALID_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', // imágenes
  'doc', 'docx', // Word
  'xls', 'xlsx', // Excel
  'vsd', 'vsdx', // Visio
  'pdf',
  'svg'
];

// Mapeo de tipos MIME a íconos
export const FILE_TYPE_ICONS: Record<string, string> = {
  'image/jpeg': 'image-file.svg',
  'image/png': 'image-file.svg',
  'image/gif': 'image-file.svg',
  'image/svg+xml': 'image-file.svg',
  'application/msword': 'word-file.svg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word-file.svg',
  'application/vnd.ms-excel': 'excel-file.svg',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel-file.svg',
  'application/vnd.visio': 'visio-file.svg',
  'application/vnd.ms-visio.drawing.main+xml': 'visio-file.svg',
  'application/pdf': 'pdf-file.svg',
  default: 'file-default.svg',
};
