import { DataSource } from 'typeorm';
import { Roles } from '../entities/Roles';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Roles);
  const roles = [
    { id: 1, code: 'super_admin', display_name: 'supper admin' },
    { id: 2, code: 'admin', display_name: 'admin' },
    { id: 3, code: 'user', display_name: 'Người dùng' },
  ];

  const existingRoles = await roleRepository.find();
  const duplicateIds = roles.some((role) =>
    existingRoles.some((existingRole) => existingRole.id === role.id),
  );

  if (duplicateIds) {
    console.log('Duplicate IDs found. Truncating table...');
    await roleRepository.clear();
  }


  for (const role of roles) {
    await roleRepository.save(role);
    console.log(`✅ Created role: ${role.code}`);
  }
};
