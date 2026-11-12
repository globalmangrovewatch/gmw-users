const USER_ROLES = {
  orgAdmin: 'org-admin',
  orgUser: 'org-user',
  superAdmin: 'admin'
} as const

Object.freeze(USER_ROLES)

export default USER_ROLES
