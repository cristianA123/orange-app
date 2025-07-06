import { ModuleDto } from '../dtos/module.dto';

export function ModuleResponse(userModules: any): {
  success: boolean;
  data: ModuleDto[];
} {
  const modules: ModuleDto[] = userModules.map(({ module }) => ({
    id: module.id,
    name: module.name,
    path: module.path,
  }));

  return {
    success: true,
    data: modules,
  };
}
