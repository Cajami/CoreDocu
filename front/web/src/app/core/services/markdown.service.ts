import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { applyMarkdownClassesUsingDOM } from '../utils/markdown.util';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private initialized = false;

  constructor(private sanitizer: DomSanitizer) {}

  async toHtml(md: string): Promise<SafeHtml> {
    let html = await marked.parse(md || '');

    // Post-proceso: agregar clases a elementos
     html = applyMarkdownClassesUsingDOM(html);

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
