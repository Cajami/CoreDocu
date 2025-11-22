import { Component, OnInit } from '@angular/core';
import { VisorMarkdownComponent } from '../../../../shared/components/visor-markdown/visor-markdown.component';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatExpansionModule } from '@angular/material/expansion';

interface MarkdownExample {
  title: string;
  markdown: string;
}

@Component({
  selector: 'app-markdown-examples',
  imports: [VisorMarkdownComponent, MatExpansionModule],
  templateUrl: './markdown-examples.component.html',
  styleUrl: './markdown-examples.component.scss',
})
export class MarkdownExamplesComponent implements OnInit {
  textMarkdown: string = '';
  htmlPreview: SafeHtml = '';

  examples: MarkdownExample[] = [
    {
      title: 'Encabezados',
      markdown: `
# Título H1
## Título H2
### Título H3
`,
    },
    {
      title: 'Párrafos y Saltos',
      markdown: `
Esto es un párrafo normal.

Esto es otro párrafo separado por una línea en blanco.
`,
    },
    {
      title: 'Texto Enriquecido',
      markdown: `
**Negrita**

*Cursiva*

~~Tachado~~

**_Negrita + Cursiva_**
`,
    },
    {
      title: 'Listas',
      markdown: `
- Item 1
- Item 2
  - Subitem
- Item 3

1. Opción uno
2. Opción dos
3. Opción tres
`,
    },
    {
      title: 'Citas',
      markdown: `
> Esto es una cita
>> Cita anidada
`,
    },
    {
      title: 'Código',
      markdown: `
\`\`\`ts
function hola() {
  console.log("Hola mundo");
}
\`\`\`
`,
    },
    {
      title: 'Imágenes',
      markdown: `
![Logo Angular](https://angular.io/assets/images/logos/angular/angular.png)
`,
    },
    {
      title: 'Tablas',
      markdown: `
| Nombre | Edad | Ciudad |
|--------|------|--------|
| Ana    | 21   | Lima   |
| Pedro  | 33   | Cusco  |
`,
    },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    fetch('data/markdown/guia.md')
      .then((res) => res.text())
      .then((md) => {
        this.textMarkdown = md;
        this.updatePreview(); // preview inicial
      });
  }

  select(example: MarkdownExample) {
    this.textMarkdown = example.markdown;
    this.updatePreview();
  }

  private updatePreview() {
    const result = marked.parse(this.textMarkdown);

    if (typeof result === 'string') {
      this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(result);
    } else {
      result
        .then((html) => {
          this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(html);
        })
        .catch((err) => {
          console.error('marked parse error', err);
          this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml('');
        });
    }
  }
}
