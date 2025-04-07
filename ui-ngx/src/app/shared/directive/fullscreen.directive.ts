import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HsAnchorComponent } from '@shared/components/hs-anchor/hs-anchor.component';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Directive({
  selector: '[hs-fullscreen]',
})
export class FullscreenDirective implements OnChanges, OnDestroy {
  private fullScreenOverlayRef: OverlayRef | null = null;
  private originalParentElement: HTMLElement | null = null;

  @Input() fullscreen: boolean = false;
  @Input() targetElement: HTMLElement | null = null;
  @Input() backgroundStyle: { [key: string]: any } | null = null;
  @Input() backgroundImage: SafeStyle | string | null = null;

  @Output() fullscreenStatusChanged = new EventEmitter<boolean>();

  constructor(
    private elRef: ElementRef,
    private render: Renderer2,
    private sanitizerService: DomSanitizer,
    private overlayService: Overlay,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fullscreen'] && !changes['fullscreen'].firstChange) {
      this.fullscreen ? this.activateFullscreen() : this.deactivateFullscreen();
    }
  }

  ngOnDestroy(): void {
    this.deactivateFullscreen();
  }

  private activateFullscreen(): void {
    const elementToFullscreen = this.targetElement || this.elRef.nativeElement;
    this.originalParentElement = elementToFullscreen.parentElement;

    if (!this.originalParentElement) {
      console.warn('Parent element not found');
      return;
    }

    this.originalParentElement.removeChild(elementToFullscreen);

    const overlayConfig = this.createOverlayConfiguration();
    this.fullScreenOverlayRef = this.overlayService.create(overlayConfig);
    this.fullScreenOverlayRef.attach(new DummyPortal());

    this.applyBackgroundStyles(this.fullScreenOverlayRef.overlayElement);
    this.fullScreenOverlayRef.overlayElement.appendChild(elementToFullscreen);

    this.fullscreenStatusChanged.emit(true);
  }

  private deactivateFullscreen(): void {
    if (!this.fullScreenOverlayRef) return;

    const elementToRestore = this.targetElement || this.elRef.nativeElement;
    if (this.originalParentElement) {
      this.fullScreenOverlayRef.overlayElement.removeChild(elementToRestore);
      this.originalParentElement.appendChild(elementToRestore);
      this.originalParentElement = null;
    }

    this.fullScreenOverlayRef.dispose();
    this.fullScreenOverlayRef = null;

    this.fullscreenStatusChanged.emit(false);
  }

  private createOverlayConfiguration(): OverlayConfig {
    const positionStrategy = this.overlayService.position();
    return new OverlayConfig({
      hasBackdrop: false,
      panelClass: 'hs-fullscreen-parent',
      minWidth: '100%',
      minHeight: '100%',
      positionStrategy: positionStrategy
        .global()
        .top('0%')
        .left('0%')
        .right('0%')
        .bottom('0%'),
    });
  }

  private applyBackgroundStyles(element: HTMLElement): void {
    if (this.backgroundStyle) {
      Object.keys(this.backgroundStyle).forEach((styleKey) => {
        this.applyStyle(element, styleKey, this.backgroundStyle![styleKey]);
      });
    }

    if (this.backgroundImage) {
      this.applyStyle(element, 'backgroundImage', this.backgroundImage);
    }
  }

  private applyStyle(
    element: HTMLElement,
    styleName: string,
    styleValue: any,
  ): void {
    const sanitizedStyleValue = this.sanitizerService.sanitize(
      SecurityContext.STYLE,
      styleValue,
    );
    if (sanitizedStyleValue !== null) {
      this.render.setStyle(element, styleName, sanitizedStyleValue);
    } else {
      this.render.removeStyle(element, styleName);
    }
  }
}

class DummyPortal extends ComponentPortal<HsAnchorComponent> {
  constructor() {
    super(HsAnchorComponent);
  }
}
