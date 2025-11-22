import { FILE_TYPE_ICONS, VALID_EXTENSIONS } from '../constants/file-types';

//Función para obtener el icono según MIME type
export function getFileIcon(type: string): string {
  return FILE_TYPE_ICONS[type] || FILE_TYPE_ICONS['default'];
}

//Función auxiliar para generar el string de “accept” del input file
export function getAcceptString(): string {
  // genera algo como: ".jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.vsd,.vsdx,.pdf"
  return VALID_EXTENSIONS.map((ext) => `.${ext}`).join(',');
}

//Convierte bytes a un texto legible (KB, MB, GB).
export function formatFileSize(bytes: number): string {
  if (!bytes && bytes !== 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let value = bytes;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(2)} ${units[index]}`;
}
