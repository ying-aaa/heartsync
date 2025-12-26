import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[hsEmptyState]',
  standalone: false,
})
export class HsEmptyStateDirective implements OnChanges, OnInit, OnDestroy {
  private static readonly STYLE_ID = 'hs-empty-state-global-style';
  private static defaultStyleCreated: boolean = false;
  private static styleElement: HTMLElement | null = null;

  @Input() isEmptyState: boolean = false;
  @Input() emptyText: string = '暂无数据';
  @Input() emptyImg: string = '/assets/svg/empty.svg';
  @Input() emptyClass: string = 'hs-empty-state';
  @Input() emptyImgClass: string = 'hs-empty-img';
  @Input() emptyTextClass: string = 'hs-empty-text';
  @Input() emptyTemplate?: TemplateRef<unknown>;

  private emptyElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private vcr: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    this.initGlobalStyles();
    this.updateEmptyState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isEmptyState'] ||
      changes['emptyText'] ||
      changes['emptyImg'] ||
      changes['emptyClass'] ||
      changes['emptyImgClass'] ||
      changes['emptyTextClass']
    ) {
      this.updateEmptyState();
    }
    if (changes['emptyTemplate']) {
      this.clearEmptyElement();
      this.updateEmptyState();
    }
  }

  private initGlobalStyles(): void {
    const existingStyle = document.getElementById(HsEmptyStateDirective.STYLE_ID);
    if (existingStyle) {
      HsEmptyStateDirective.styleElement = existingStyle;
      HsEmptyStateDirective.defaultStyleCreated = true;
    } else if (!HsEmptyStateDirective.defaultStyleCreated) {
      const hostEl = this.el.nativeElement;
      const currentPosition = getComputedStyle(hostEl).position;
      if (!currentPosition || currentPosition === 'static') {
        this.renderer.setStyle(hostEl, 'position', 'relative');
      }

      HsEmptyStateDirective.styleElement = this.renderer.createElement('style');
      this.renderer.setAttribute(
        HsEmptyStateDirective.styleElement,
        'id',
        HsEmptyStateDirective.STYLE_ID,
      );
      const styleText = `
        .hs-empty-state {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          z-index: 1;
        }
        .hs-empty-text {
          color: #999;
          font-size: 14px;
          line-height: 1.5;
          text-align: center;
        }
      `;
      this.renderer.setProperty(HsEmptyStateDirective.styleElement, 'innerHTML', styleText);
      this.renderer.appendChild(document.head, HsEmptyStateDirective.styleElement);

      HsEmptyStateDirective.defaultStyleCreated = true;
    } else {
      const hostEl = this.el.nativeElement;
      const currentPosition = getComputedStyle(hostEl).position;
      if (!currentPosition || currentPosition === 'static') {
        this.renderer.setStyle(hostEl, 'position', 'relative');
      }
    }
  }

  private updateEmptyState(): void {
    this.clearEmptyElement();
    if (this.isEmptyState) {
      this.createEmptyElement();
    }
  }

  private createEmptyElement(): void {
    if (this.emptyTemplate) {
      this.vcr.createEmbeddedView(this.emptyTemplate);
      return;
    }

    this.emptyElement = this.renderer.createElement('div');
    this.emptyClass.split(' ').forEach((cls) => {
      if (cls.trim()) this.renderer.addClass(this.emptyElement!, cls);
    });

    if (this.emptyImg.trim()) {
      const imgEl = this.renderer.createElement('img');
      this.renderer.setAttribute(imgEl, 'src', this.emptyImg);
      this.renderer.setAttribute(imgEl, 'alt', this.emptyText);
      this.emptyImgClass.split(' ').forEach((cls) => {
        if (cls.trim()) this.renderer.addClass(imgEl, cls);
      });
      this.renderer.appendChild(this.emptyElement!, imgEl);
    }

    const textEl = this.renderer.createElement('div');
    this.renderer.setProperty(textEl, 'textContent', this.emptyText);
    this.emptyTextClass.split(' ').forEach((cls) => {
      if (cls.trim()) this.renderer.addClass(textEl, cls);
    });
    this.renderer.appendChild(this.emptyElement!, textEl);

    this.renderer.appendChild(this.el.nativeElement, this.emptyElement);
  }

  private clearEmptyElement(): void {
    this.vcr.clear();
    if (this.emptyElement) {
      this.renderer.removeChild(this.el.nativeElement, this.emptyElement);
      this.emptyElement = null;
    }
  }

  ngOnDestroy(): void {
    this.clearEmptyElement();
  }
}
