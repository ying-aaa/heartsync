// svg.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SvgService } from '@src/app/core/http/svg.service';

@Component({
  selector: 'hs-svg',
  template: `
    <div
      [class]="containerClass"
      [style]="containerStyle"
    >
      @if (!svgContent && !error) {
        <div class="loading">Loading...</div>
      }

      @if (error) {
        <div class="error">未找到SVG</div>
      }

      <div
        [ngStyle]="{ width, height }"
        [innerHTML]="svgContent"
        [class]="svgClass"
        [style]="svgStyle"
      ></div>
      @if (title) {
        <div class="text-center">{{ title }}</div>
      } @else {
        <ng-content></ng-content>
      }
    </div>
  `,
  standalone: false,
})
export class SvgComponent implements OnChanges {
  @Input() name: string;
  @Input() title: string;
  @Input() svgClass = '';
  @Input() svgStyle = '';
  @Input() containerClass = '';
  @Input() containerStyle = '';
  @Input() color = '';
  @Input() width = '100%';
  @Input() height = '100%';

  svgContent: SafeHtml;
  error = false;

  constructor(
    private svgService: SvgService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name']) {
      this.loadSvg();
    }
  }

  private loadSvg(): void {
    if (!this.name) {
      this.error = true;
      return;
    }

    this.svgService.loadSvg(this.name).subscribe({
      next: (svg) => this.processSvg(svg),
      error: () => this.handleError(),
    });
  }

  private processSvg(svg: string): void {
    if (!svg) {
      this.handleError();
      return;
    }

    // 应用颜色和尺寸
    const processedSvg = this.applyStyles(svg);
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(processedSvg);
    this.error = false;
  }

  private applyStyles(svg: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgElement = doc.documentElement;

    if (this.color) {
      svgElement.setAttribute('fill', this.color);
    }
    svgElement.setAttribute('width', this.width);
    svgElement.setAttribute('height', this.height);

    return svgElement.outerHTML;
  }

  private handleError(): void {
    this.error = true;
    this.svgContent = '';
  }
}
