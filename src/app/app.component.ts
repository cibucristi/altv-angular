import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { GameComponentRegistry } from './decorators/dynamic-component';
import { ViewComponent } from './view/view.component';
import { ViewHandlerService } from './services/view-handler.service';
import { IComponent } from './interfaces/component.interface';
import { ViewComponentsModule } from './view/view-components.module';
import { ALTVService } from './services/altv.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ViewComponent, ViewComponentsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'altv-angular';

  isAlt: boolean = (window as any).isAlt;
  devMode: boolean = environment.production;

  constructor(
    private readonly viewHandler: ViewHandlerService,
    private readonly altv: ALTVService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();

    /**
     * We make our own method since we can call changeDetectorRef.
     */
    this.altv.addEvent('renderComponent', (component: string) => this.renderComponent(component));
    this.altv.addEvent('unrenderComponent', (component: string) => this.unrenderComponent(component));
  }

  /**
   * This line emits an client event which tells altv is the Angular instance has loaded.
   */
  ngAfterViewInit(): void {
    this.altv.sendClient('onBrowserLoaded');
  }

  /**
   * Gets all the components registered in the GameComponentRegistry map.
   * @returns all component names
   */
  getAllComponentNames() {
    return [...GameComponentRegistry.keys()]
  }

  /**
   * Triggered when you enter the mouse over the dev menu.
   * @param value boolean
   */
  toggleDevMenu(value: boolean): void {
    this.devMode = value;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Renders a component in the view.
   * @param component component name
   */
  renderComponent(component: string) {
    this.viewHandler.renderComponent(component);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Unrenders a component from the view.
   * @param component component name
   */
  unrenderComponent(component: string) {
    this.viewHandler.unrenderComponent(component);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * This method is called when a component name is pressed in the Development Menu.
   * @param component component name
   */
  onComponentSelected(component: string) {
    !this.viewHandler.isComponentLoaded(component) ? this.renderComponent(component) : this.unrenderComponent(component);
  }

  get components(): IComponent[] {
    return this.viewHandler.getComponentsList();
  }
}
