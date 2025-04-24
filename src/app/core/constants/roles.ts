export const ROLES = {
  INTERNAL_USER: 'internalUser',
  SUPER_USER: 'superUser',
  ADMIN: 'admin',
  DELIVERY: 'delivery',
  WAITER: 'waiter',
  CUSTOMER: 'customer',

  PRODUCTS: 'products',
  ORDERS: 'orders',
} as const;

export const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Products', value: 'products' },
  { label: 'Orders', value: 'orders' },
  { label: 'Staff', value: 'staff' },
];
