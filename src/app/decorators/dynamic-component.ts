export const ComponentRuntimeInstances: Map<string, any> = new Map<string, any>();

export function ComponentRuntimeInstance(name: string): ClassDecorator {
  return (target: any) => {
    ComponentRuntimeInstances.set(name, target);
  };
}

export const GameComponentRegistry: Map<string, any> = new Map<string, any>();

export function GameComponent(name: string): ClassDecorator {
  return (target: any) => {
    GameComponentRegistry.set(name, target);
  };
}
