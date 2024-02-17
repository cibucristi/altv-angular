import { EventEmitter, Injectable } from '@angular/core';
import { IComponent } from '../interfaces/component.interface';
import { ComponentRuntimeInstances } from '../decorators/dynamic-component';

@Injectable({
  providedIn: 'root'
})
export class ViewHandlerService {

  // Array to hold the list of the components rendered in the view.
  private componentsList: Array<IComponent> = [];

  // Map to store timeouts for unloading components.
  private unloadTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();

  // EventEmitter to emit events when the components list changes.
  private listChanged: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Renders a component in the view.
   * @param component component name
   */
  public renderComponent(component: string) {
    const component_str = component.toString();
    const index = this.componentsList.findIndex(
      (componentEntry: IComponent) =>
        componentEntry.identifier == component.toString()
    );

    if (index != -1) {

      const timeout = this.unloadTimeouts.get(component_str);

      // If there's a timeout set for unloading the component, clear it and remove the component from the list.
      if (timeout) {
        clearTimeout(timeout);
        this.unloadTimeouts.delete(component_str);
        this.componentsList.splice(index, 1);
      } else {
        return;
      }
    }

    // Add the component to the list and emit a list change event.
    this.componentsList.push({ identifier: component_str });
    this.listChanged.emit();
  }

  /**
   * Unrenders a component from the view.
   * @param component component name 
   */
  public unrenderComponent(component: string) {
    const index = this.componentsList.findIndex(
      (componentEntry: IComponent) =>
        componentEntry.identifier == component.toString()
    );

    if (index == -1) return;

    const timeout = this.unloadTimeouts.get(component.toString());

    // If there's a timeout set for unloading the component, clear it.
    if (timeout) {
      clearTimeout(timeout);
      this.unloadTimeouts.delete(component.toString());
    }

    const runtime = ComponentRuntimeInstances.get(component.toString());

    // If there's a runtime instance for the component, check if it has an onUnload method.
    if (runtime) {
      const time = runtime.onUnload ? runtime.onUnload() : 0;

      // If the onUnload method returns a positive time, set a timeout to remove the component after that time.
      if (time > 0) {
        this.unloadTimeouts.set(component.toString(), setTimeout(() => {
          this.componentsList.splice(index, 1);
          this.listChanged.emit();
        }, time));
        return;
      }
    }

    // If no onUnload method or if it returns 0, immediately remove the component from the list.
    this.componentsList.splice(index, 1);
    this.listChanged.emit();
  }

  /**
   * Gets the component list rendered in the view.
   * @returns IComponent array
   */
  public getComponentsList(): Array<IComponent> {
    return this.componentsList;
  }

  /**
   * Checks if the component is loaded in the view.
   * @param component component name to be checked
   * @returns boolean
   */
  public isComponentLoaded(component: string): boolean {
    return this.componentsList.findIndex((componentEntry: IComponent) => componentEntry.identifier == component.toString()) > -1;
  }
}
