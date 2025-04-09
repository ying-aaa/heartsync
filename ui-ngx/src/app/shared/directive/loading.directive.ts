import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[ngLoading]',
})
export class LoadingDirective {
  @Input() isLoading: boolean = false; // 控制加载动画的显示与隐藏
  @Input() message: string = 'Loading...'; // 加载时的提示信息

  private overlay: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateOverlayPosition();
  }

  ngOnInit() {
    this.updateOverlay();
  }

  ngOnChanges() {
    this.updateOverlay();
  }

  private updateOverlay() {
    if (this.isLoading) {
      if (!this.overlay) {
        this.createOverlay();
      }
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }

  private createOverlay() {
    this.overlay = this.renderer.createElement('div');
    this.renderer.addClass(this.overlay, 'loading-overlay');
    this.renderer.setStyle(this.overlay, 'position', 'absolute');
    this.renderer.setStyle(this.overlay, 'top', '0');
    this.renderer.setStyle(this.overlay, 'left', '0');
    this.renderer.setStyle(this.overlay, 'width', '100%');
    this.renderer.setStyle(this.overlay, 'height', '100%');
    this.renderer.setStyle(
      this.overlay,
      'background-color',
      'var(--base-bg-color)',
    );
    this.renderer.setStyle(this.overlay, 'display', 'flex');
    this.renderer.setStyle(this.overlay, 'justify-content', 'center');
    this.renderer.setStyle(this.overlay, 'align-items', 'center');
    this.renderer.setStyle(this.overlay, 'color', 'white');
    this.renderer.setStyle(this.overlay, 'font-size', '20px');
    this.renderer.setStyle(this.overlay, 'z-index', '1000');

    this.renderer.appendChild(this.overlay, this.createLoader());
    this.renderer.appendChild(this.el.nativeElement, this.overlay);
  }

  private createLoader() {
    const loader = this.renderer.createElement('div');
    this.renderer.addClass(loader, 'loader');
    for (let i = 0; i < 6; i++) {
      const span = this.renderer.createElement('span');
      this.renderer.appendChild(loader, span);
    }
    return loader;
  }

  private showOverlay() {
    if (this.overlay) {
      this.renderer.setStyle(this.overlay, 'display', 'flex');
      this.updateOverlayPosition();
    }
  }

  private hideOverlay() {
    if (this.overlay) {
      this.renderer.setStyle(this.overlay, 'display', 'none');
    }
  }

  private updateOverlayPosition() {
    if (this.overlay) {
      const hostElement = this.el.nativeElement;
      const rect = hostElement.getBoundingClientRect();
      this.renderer.setStyle(this.overlay, 'top', `${rect.top}px`);
      this.renderer.setStyle(this.overlay, 'left', `${rect.left}px`);
      this.renderer.setStyle(this.overlay, 'width', `${rect.width}px`);
      this.renderer.setStyle(this.overlay, 'height', `${rect.height}px`);
    }
  }
}
