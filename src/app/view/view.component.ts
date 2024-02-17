import { Component, ComponentRef, Input, OnChanges, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { GameComponentRegistry, ComponentRuntimeInstances } from '../decorators/dynamic-component';
import { ALTVService } from '../services/altv.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'view-component', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss' 
})
export class ViewComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly game: ALTVService,
  ) {}
  
  dynamicRef!: ComponentRef<any>;

  @Input()
  public component: string = ''; // Input property to specify the component which to render.

  ngOnInit() {
    const component = GameComponentRegistry.get(this.component.toString());
    if (!component) return;

    // Creates the component into the view.
    this.dynamicRef = this.viewContainerRef.createComponent(component);

    this.dynamicRef.location.nativeElement.classList.add('dynamic-component');
    ComponentRuntimeInstances.set(
      this.component.toString(),
      this.dynamicRef.instance
    );

    // Notify the server and client that the component has been succesfully loaded in the view.
    this.game.sendServer('browserComponentLoaded', this.component),
    this.game.sendClient('browserComponentLoaded', this.component);
    setTimeout(() => {
      this.dynamicRef.changeDetectorRef.detectChanges();
    }, 20);
  }

  ngOnChanges() {
    setTimeout(() => {
      if (!this.dynamicRef) return;
      this.dynamicRef.changeDetectorRef.detectChanges();
    }, 100);
  }

  ngOnDestroy() {
    if (!GameComponentRegistry.get(this.component)) return;

    if (GameComponentRegistry.get(this.component)) {
      // Notify the server and client that the component was unloaded from the view.
      this.game.sendClient('browserComponentUnloaded', this.component);
      this.game.sendServer('browserComponentUnloaded', this.component);
      ComponentRuntimeInstances.delete(this.component);
      this.dynamicRef.destroy(), this.viewContainerRef.clear();
    }
  }
}
