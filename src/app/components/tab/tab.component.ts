import { Component, ContentChildren, Input, QueryList, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-tab',
  template: `
  @for(name of names; track name; let index = $index) {
    <button (click)="changeTab(index)">{{name}}</button>
  }
  <ng-template #main></ng-template>
  `,
  styles: ``
})
export class TabComponent {
  @Input() names!: string[];
  @ContentChildren('template') items!: QueryList<any>;
  @ViewChild("main", { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  currentTab: TemplateRef<any>;

  constructor() { }

  changeState(template: TemplateRef<HTMLTemplateElement>) {
    this.container.clear();
    this.container.createEmbeddedView(template);
  }

  changeTab(index: number) {
    const template = this.items.get(index);
    this.changeState(template);
  }
}
