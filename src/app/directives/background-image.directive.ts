import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appBackgroundImage]'
})
export class BackgroundImageDirective implements OnChanges {
  @Input() appBackgroundImage: string | undefined;

  constructor(private el: ElementRef, private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appBackgroundImage']) {
      this.setBackgroundImage();
    }
  }

  private setBackgroundImage() {
    if (this.appBackgroundImage) {
      const safeStyle = this.sanitizer.bypassSecurityTrustStyle(`url(${this.appBackgroundImage})`);
      this.el.nativeElement.style.backgroundImage = safeStyle;
    }
  }
}
