import { RoleEnum } from "../../enums";

export const rolesMockData = [
  {
    name: RoleEnum.ADMIN,
    description: "Administrator",
  },
  {
    name: RoleEnum.USER,
    description: "Users applying for the events",
  },
  {
    name: RoleEnum.STAFF,
    description: "staff that create events, manage events, manage users.",
  },
  {
    name: RoleEnum.ACCOUNTANT,
    description:
      "Accountants work in to initiate pay the users that attend events.",
  },
];
