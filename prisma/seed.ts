import { RoleEnum } from '../src/enums/role-enum';
import { prismaClient } from "../src/app"
import { menusMockData, rolesMockData } from "../src/utils";
import { hashSync } from 'bcrypt';
import { lookUpsMockData } from '../src/utils/data/lookups-mock-data';

const main = async () => {
  rolesMockData.forEach(async role => {
    await prismaClient.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: {
        name: role.name,
        description: role.description
      }
    })
  });


  //seed lookups
  lookUpsMockData.forEach(async lookup => {
    await prismaClient.lookups.upsert({
      where: { code: lookup.code },
      update: { name: lookup.name, description: lookup.description, amount: lookup.amount, isVisible: lookup.isVisible, category: lookup.category },
      create: {
        code: lookup.code,
        name: lookup.name,
        amount: lookup.amount,
        description: lookup.description,
        category: lookup.category,
        isVisible: lookup.isVisible
      }
    })
  });

  //seed admin user
  const admin = await prismaClient.user.upsert({
    where: { nationalID: 123456 },
    update: {},
    create: {
      name: 'Admin Developer',
      nationalID: 123456,
      email: "Niclausel@gmail.com",
      staffNo: "VEND1260",
      jobGroup: 'N',
      jobTitle: 'Senior Full Stack software developer',
      phoneNumber: "+254700158948",
      password: hashSync("123@Team.,", 10),
    }
  });

  // allocate admin user an admin role 
  const adminRole = await prismaClient.role.findFirst({ where: { name: RoleEnum.ADMIN } });
  const checkIfCreated = await prismaClient.userRole.findFirst({ where: { roleId: adminRole?.id, userId: admin?.id } })
  if (!checkIfCreated && adminRole) {
    await prismaClient.userRole.create({
      data: {
        userId: admin.id,
        roleId: adminRole.id,
      }
    })
  }


  // seed menus
  menusMockData.forEach(async mn => {
    const newMenu = await prismaClient.menu.upsert({
      where: { name: mn.code },
      update: { ...mn },
      create: { ...mn }
    })
    const roles = await prismaClient.role.findMany();
    roles.forEach(async role => {
      if (newMenu.code === 'ADMIN' && role.name !== RoleEnum.ADMIN) return;
      const roleExist = await prismaClient.menuRole.findFirst({ where: { roleId: role?.id, menuId: newMenu?.id } })
      if (!roleExist && newMenu) {
        await prismaClient.menuRole.create({
          data: {
            roleId: role.id,
            menuId: newMenu.id
          }
        })
      }

    })

  });

}

main().then(async () => {
  await prismaClient.$disconnect();
}).catch(async (e) => {
  console.log(e);
  await prismaClient.$disconnect();
  process.exit(1)
})