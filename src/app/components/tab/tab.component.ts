import {Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewContainerRef, afterNextRender} from '@angular/core';

@Component({
  selector: 'app-tab',
  template: `
  <div class="container">
    @for(name of names; track name; let index = $index) {
      <button class="btn p-2"
        [class.btn-success]="currentIndex === index"
        [class.btn-info]="currentIndex !== index"
        (click)="changeTab(index)">{{name}}</button>
      <span class="close" (click)="remove(index)">&times;</span>
    }
  </div>
  <ng-template #main></ng-template>
  `,
  styles: `
    .container {
      overflow: auto;
      display: flex;
      scrollbar-width: none;
    }
    .container::-webkit-scrollbar { 
      display: none;  /* Safari and Chrome */
    }
    button { margin: 5px}
  `
})
export class TabComponent {
  @Input() names!: string[];
  @Output() removeTab: EventEmitter<number> = new EventEmitter<number>();
  @ContentChildren('template') items!: QueryList<any>;
  @ViewChild("main", { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  currentTab: TemplateRef<any>;
  currentIndex: number = 0;

  constructor() {
    afterNextRender(() => {
      // activated when content children changes
      this.items.changes.subscribe(() => {
        // try updating if no views in the containers
        const template = this.items.get(this.currentIndex);
        if (!this.container.length && template) {
          this.changeState(template);
        }
      });
    })
  }

  changeState(template: TemplateRef<HTMLTemplateElement>) {
    this.container.clear();
    this.container.createEmbeddedView(template);
  }

  changeTab(index: number) {
    this.currentIndex = index;
    const template = this.items.get(index);
    if (template) {
      this.changeState(template);
    } else {
      this.container.clear();
    }
  }

  remove(index: number) {
    // change into new index if the length is max
    const newIndexCondition = index == this.names.length - 1 && index > 0;
    this.currentIndex = newIndexCondition ? index - 1 : index;
    this.container.clear();
    this.removeTab.emit(index);
  }
}
