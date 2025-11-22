// src/app/utils/markdown-utils.ts
export function applyMarkdownClassesUsingDOM(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html || '', 'text/html');

  // patrón para detectar {.class1 .class2}
  const tailPattern = /^\s*\{\.([a-zA-Z0-9_\-.\s]+)\}\s*$/;
  const tailInlinePattern = /\s*\{\.([a-zA-Z0-9_\-.\s]+)\}\s*$/;

  // 1) Recorremos text nodes para detectar nodos que contienen solo "{.clases}"
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const nodesToRemove: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (!node || !node.nodeValue) continue;

    const match = node.nodeValue.match(tailPattern);
    if (!match) continue;

    const classesRaw = match[1];
    const classes = classesRaw
      .split(/\s+/)
      .map((c) => c.replace(/^\./, '').trim())
      .filter(Boolean)
      .join(' ');

    // buscamos el elemento previo visible (saltar espacios en blanco)
    let prev: Node | null = node.previousSibling;
    while (
      prev &&
      prev.nodeType === Node.TEXT_NODE &&
      !/\S/.test(prev.nodeValue || '')
    ) {
      prev = prev.previousSibling;
    }

    if (prev && prev.nodeType === Node.ELEMENT_NODE) {
      const el = prev as Element;
      // anexar clases
      el.className = (el.className ? el.className + ' ' : '') + classes;
    } else {
      // si no hay prev, aplicamos a parent element
      const parent = node.parentElement;
      if (parent) {
        // si el patrón estaba dentro del innerHTML del padre, lo eliminamos
        parent.innerHTML = parent.innerHTML.replace(tailInlinePattern, '');
        parent.className =
          (parent.className ? parent.className + ' ' : '') + classes;
      }
    }

    nodesToRemove.push(node);
  }

  // eliminar nodos de texto procesados
  nodesToRemove.forEach((n) => n.parentNode?.removeChild(n));

  // 2) Recorremos elementos que tengan el patrón al final del innerHTML
  const elements = doc.querySelectorAll(
    'h1,h2,h3,h4,h5,h6,p,li,div,span,blockquote'
  );
  elements.forEach((el) => {
    const inner = el.innerHTML;
    const m = inner.match(tailInlinePattern);
    if (m) {
      const classes = m[1]
        .split(/\s+/)
        .map((c) => c.replace(/^\./, '').trim())
        .filter(Boolean)
        .join(' ');
      // limpiar el sufijo del innerHTML
      el.innerHTML = inner.replace(tailInlinePattern, '');
      el.className = (el.className ? el.className + ' ' : '') + classes;
    }
  });

  // 3) Caso: marked pudo haber creado id que incluyen el sufijo.
  // Normalizamos ids que contengan '{.' por error (ej: id="titulo{.cls}")
  const allEls = doc.querySelectorAll<HTMLElement>('*');
  allEls.forEach((el) => {
    if (el.id && el.id.includes('{.')) {
      // eliminar la parte {...} del id
      el.id = el.id
        .replace(/\{\.([^\}]+)\}/g, '')
        .replace(/[^\w\-]/g, '')
        .trim();
      if (el.id === '') el.removeAttribute('id');
    }
  });

  return doc.body.innerHTML;
}
