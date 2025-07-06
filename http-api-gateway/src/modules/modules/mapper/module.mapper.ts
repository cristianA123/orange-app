import { UserModule } from '../../../typeorm/entities/UserModule';
import { ModuleDto } from '../dtos/module.dto';

export function ModuleResponse(userModules: UserModule[]) {
  const modulesMap = new Map<string, ModuleDto>();

  for (const { module } of userModules) {
    if (module.isMainModule) {
      modulesMap.set(module.id, {
        id: module.id,
        name: module.name,
        path: module.path,
        children: [],
      });
    }
  }

  for (const { module } of userModules) {
    if (!module.isMainModule && module.parent?.id) {
      const parent = modulesMap.get(module.parent.id);
      if (parent) {
        parent.children.push({
          id: module.id,
          name: module.name,
          path: module.path,
        });
      }
    }
  }

  return {
    success: true,
    data: Array.from(modulesMap.values()),
  };
}
