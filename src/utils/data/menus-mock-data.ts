import { MenusModel } from "../../models/menus-model";

export const menusMockData: MenusModel[] = [
  {
    code: 'DASHBOARD',
    name: 'DASHBOARD',
    title: 'Dashboard',
    tooltip: 'Summary',
    iconName: '<MdDashboard />',
    route: '/dashboard',
    routeTitle: 'Events Summary',
    ordering: 1,
    parent: null,
    level: 0,
    expandOnly: false,
    isVisible: true,
  },
  {
    code: 'MANAGEEVENT',
    name: 'MANAGEEVENT',
    title: 'Manage Event',
    tooltip: 'See events listing, create, update and delete an event',
    iconName: '',
    route: '/events',
    routeTitle: 'manage events',
    ordering: 2,
    parent: null,
    level: 0,
    expandOnly: false,
    isVisible: true,
  },
  {
    code: 'ATTENDANCE',
    name: 'ATTENDANCE',
    title: 'Attendance',
    tooltip: 'List of attendee that have registered',
    iconName: '',
    route: '/attendance',
    routeTitle: 'Events Confirmations',
    ordering: 3,
    parent: null,
    level: 0,
    expandOnly: false,
    isVisible: true,
  },
  {
    code: 'PAYMENTS',
    name: 'PAYMENTS',
    title: 'Payments',
    tooltip: 'Pay the attendee that attended the event.',
    iconName: '',
    route: '/payments',
    routeTitle: 'Making payments',
    ordering: 4,
    parent: null,
    level: 0,
    expandOnly: false,
    isVisible: true,
  },
  {
    code: 'ADMIN',
    name: 'ADMIN',
    title: 'Administration',
    tooltip: 'Pay the attendee that attended the event.',
    iconName: '',
    route: '/payments',
    routeTitle: 'Making payments',
    ordering: 5,
    parent: null,
    level: 0,
    expandOnly: false,
    isVisible: true,
  },
];
