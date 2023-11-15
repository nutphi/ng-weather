import { Component, HostListener, Input, TemplateRef, ViewChild, ViewContainerRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() observable!: Observable<any>;
  @ViewChild("add", {read: TemplateRef, static: true}) addTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("adding", {read: TemplateRef, static: true}) addingTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("done", {read: TemplateRef, static: true}) doneTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("container", { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  destroyRef = inject(DestroyRef);

  @HostListener('click') onClick() {
    if (this.observable) {
      this.changeState(this.addingTemp);
      this.observable.pipe(
        tap(() => this.changeState(this.doneTemp)),
        delay(500),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.changeState(this.addTemp);
      });
    }

  }

  constructor() { }

  ngAfterViewInit() {
    this.container.createEmbeddedView(this.addTemp);
  }

  changeState(template: TemplateRef<HTMLTemplateElement>) {
    this.container.clear();
    this.container.createEmbeddedView(template);
  }
}
