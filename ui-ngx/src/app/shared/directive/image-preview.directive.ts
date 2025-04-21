import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[hs-image-preview]',
  standalone: false, // 明确指定这个 Directive 不是独立的
})
export class HsImagePreviewDirective {
  private imgPreview: HTMLImageElement;
  private overlay: HTMLDivElement;
  @Input('previewSrc') previewSrc: string;
  @Input('previewWidth') previewWidth: number = 300;
  @Input('previewHeight') previewHeight: number = 300;

  constructor(private el: ElementRef) {
    this.createOverlay();
    this.createImagePreview();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.overlay.style.display = 'none';
    this.overlay.style.zIndex = '9999';
    document.body.appendChild(this.overlay);
  }

  createImagePreview() {
    this.imgPreview = document.createElement('img');
    this.imgPreview.style.position = 'fixed';
    this.imgPreview.style.top = '50%';
    this.imgPreview.style.left = '50%';
    this.imgPreview.style.transform = 'translate(-50%, -50%)';
    this.imgPreview.style.maxWidth = this.previewWidth + 'px';
    this.imgPreview.style.maxHeight = this.previewHeight + 'px';
    this.imgPreview.style.display = 'none';
    this.imgPreview.style.zIndex = '10000';
    document.body.appendChild(this.imgPreview);
  }

  @HostListener('click', ['$event'])
  onClick() {
    if (this.previewSrc) {
      this.imgPreview.src = this.previewSrc;
      this.overlay.style.display = 'block';
      this.imgPreview.style.display = 'block';
    }
  }

  @HostListener('window:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (event.target === this.overlay || event.target === this.imgPreview) {
      this.overlay.style.display = 'none';
      this.imgPreview.style.display = 'none';
    }
  }
}
