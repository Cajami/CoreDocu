import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MarkdownService } from '../../../core/services/markdown.service';
import svgPanZoom from 'svg-pan-zoom';

interface Heading {
  id: string;
  text: string;
  level: number;
}

type SvgPanZoomInstance = {
  instance: any;
  objectEl: HTMLObjectElement;
};

@Component({
  selector: 'app-visor-markdown',
  imports: [CommonModule],
  templateUrl: './visor-markdown.component.html',
  styleUrl: './visor-markdown.component.scss',
  host: {
    class: 'block w-full',
  },
})
export class VisorMarkdownComponent implements OnChanges, OnDestroy {
  @ViewChild('contentRef') contentRef!: ElementRef;

  @Input() textMarkDown: string = '';
  html: string = '';

  headingActiva: string | null = null;
  listaHeadings: Heading[] = [];

  // guardamos instancias para limpiar
  private svgInstances: SvgPanZoomInstance[] = [];

  constructor(private markdownService: MarkdownService) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['textMarkDown']) {
      // 1) Convertir markdown → HTML
      this.html = (await this.markdownService.toHtml(
        this.textMarkDown
      )) as string;

      // 2) Esperar a que Angular actualice el DOM
      setTimeout(() => {
        this.extractHeadings();

        this.replaceSvgMarkedImages();
        this.initSvgPanZoomAll();

        if (this.listaHeadings.length > 0)
          this.headingActiva = this.listaHeadings[0].id;

      }, 0);
    }
  }

  extractHeadings() {
    const host = this.contentRef.nativeElement;
    const hs = host.querySelectorAll('h1, h2, h3');

    const data: Heading[] = [];

    hs.forEach((h: HTMLElement, index: number) => {
      const id = h.innerText.toLowerCase().replace(/[\s]+/g, '-');
      h.id = id;

      data.push({
        id,
        text: h.innerText,
        level: parseInt(h.tagName.substring(1), 10),
      });
    });

    this.listaHeadings = data;
  }

  /**
   * Reemplaza <img class="svg-panzoom" src="..."> por <object type="image/svg+xml" data="...">
   */
  private replaceSvgMarkedImages() {
    if (!this.contentRef) return;
    const host = this.contentRef.nativeElement as HTMLElement;

    // busca imágenes marcadas
    const imgs = Array.from(
      host.querySelectorAll('img.svg-panzoom')
    ) as HTMLImageElement[];

    imgs.forEach((img) => {
      const src = img.getAttribute('src');
      if (!src) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'svg-object-wrapper relative w-full';

      const obj = document.createElement('object');
      obj.setAttribute('type', 'image/svg+xml');
      obj.setAttribute('data', src);
      obj.className = 'w-full h-auto border border-gray-200 p-3';

      // opcional: placeholder mientras carga
      const placeholder = document.createElement('div');
      placeholder.className =
        'svg-placeholder w-full py-8 text-center text-sm text-gray-500';
      placeholder.textContent = 'Cargando diagrama...';

      wrapper.appendChild(placeholder);
      wrapper.appendChild(obj);

      img.replaceWith(wrapper);
    });
  }

  /**
   * Inicializa svg-pan-zoom para cada object[type="image/svg+xml"]
   */
  private initSvgPanZoomAll() {
    if (!this.contentRef) return;
    const host = this.contentRef.nativeElement as HTMLElement;

    // limpiamos instancias previas antes de volver a inicializar (si re-render)
    this.destroyAllSvgPanZoom();

    const objects = Array.from(
      host.querySelectorAll('object[type="image/svg+xml"]')
    ) as HTMLObjectElement[];

    objects.forEach((obj) => {
      // cada object puede ya haberse inicializado; agregamos listener load
      obj.addEventListener('load', () => {
        try {
          const svgDoc = obj.contentDocument;
          if (!svgDoc) return;
          const svg = svgDoc.querySelector('svg') as SVGSVGElement | null;
          if (!svg) return;

          // Quitar background declarado
          svg.style.background = 'white';

          // Buscar rectángulos de fondo negro
          const rects = svg.querySelectorAll('rect');
          rects.forEach((r) => {
            const fill = r.getAttribute('fill');
            if (fill && fill.toLowerCase() === '#000000') {
              r.setAttribute('fill', 'white');
            }
          });

          // Encontrar wrapper para quitar placeholder
          const wrapper = obj.parentElement;
          const placeholder = wrapper?.querySelector('.svg-placeholder');
          placeholder?.remove();

          // configurar svg-pan-zoom
          const instance = svgPanZoom(svg, {
            zoomEnabled: true,
            controlIconsEnabled: false, // si quieres controles nativos, true
            fit: true,
            center: true,
            minZoom: 0.5,
            maxZoom: 10,
            dblClickZoomEnabled: true,
            mouseWheelZoomEnabled: false,
            preventMouseEventsDefault: false, // permite eventos internos si draw.io los usa
          });

          // guardar instancia para limpiar después
          this.svgInstances.push({ instance, objectEl: obj });

          svg.addEventListener('wheel', (event: WheelEvent) => {
            // Solo permitir zoom si SHIFT está presionado
            if (!event.shiftKey) return;

            event.preventDefault();
            event.stopPropagation();

            // // Dirección del zoom
            const zoomIn = event.deltaY < 0;

            if (zoomIn) {
              instance.zoomIn();
            } else {
              instance.zoomOut();
            }
          });

          // opcional: agregar controles overlay (zoom in/out/reset)
          this.attachControlsToWrapper(wrapper as HTMLElement, instance);
        } catch (err) {
          console.error('Error inicializando svg-pan-zoom', err);
        }
      });

      // Si el object ya está cargado
      if ((obj as any).contentDocument) {
        const ev = new Event('load');
        obj.dispatchEvent(ev);
      }
    });
  }

  /**
   * Añade controles de zoom overlay (opcionales)
   */
  private attachControlsToWrapper(wrapper: HTMLElement, instance: any) {
    if (!wrapper) return;

    // Crear contenedor de controles si no existe
    let controls = wrapper.querySelector('.svg-controls') as HTMLElement | null;
    if (!controls) {
      controls = document.createElement('div');
      controls.className =
        'svg-controls absolute right-2 top-2 flex gap-2 bg-white/80 rounded p-1 shadow';
      controls.style.zIndex = '20';
      wrapper.appendChild(controls);
    } else {
      controls.innerHTML = '';
    }

    const btn = (label: string, fn: () => void) => {
      const b = document.createElement('button');
      b.className = 'px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200';
      b.textContent = label;
      b.onclick = fn;
      return b;
    };

    controls.appendChild(btn('+', () => instance.zoomIn()));
    controls.appendChild(btn('−', () => instance.zoomOut()));
    controls.appendChild(
      btn('Reset', () => {
        instance.resetZoom();
        instance.center();
        instance.fit();
      })
    );
  }

  private destroyAllSvgPanZoom() {
    this.svgInstances.forEach((s) => {
      try {
        s.instance?.destroy?.();
      } catch (e) {
        /* ignore */
      }
    });
    this.svgInstances = [];
  }

  scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.headingActiva = id;
  }

  ngOnDestroy(): void {
    this.destroyAllSvgPanZoom();
  }
}
