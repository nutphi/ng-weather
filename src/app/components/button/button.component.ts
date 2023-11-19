import {Component, DestroyRef, HostListener, Input, TemplateRef, ViewChild, ViewContainerRef, afterNextRender, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() observable$: Observable<any>;
  @Input() valid$: Observable<boolean>;
  @ViewChild("add", {read: TemplateRef, static: true}) addTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("adding", { read: TemplateRef, static: true }) addingTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("failed", {read: TemplateRef, static: true}) failedTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("done", {read: TemplateRef, static: true}) doneTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("container", { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  destroyRef = inject(DestroyRef);

  @HostListener('click') onClick() {
    this.changeState(this.addingTemp);
    this.observable$.pipe(
      tap(() => this.changeState(this.doneTemp)),
      delay(500),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.changeState(this.addTemp);
    });
  }

  constructor() {
    afterNextRender(() => {
      this.valid$.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((isValid) => {
        this.changeState(isValid ? this.addTemp: this.failedTemp);
      });
    });
  }

  changeState(template: TemplateRef<HTMLTemplateElement>) {
    this.container.clear();
    this.container.createEmbeddedView(template);
  }
}
