import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth()
    return sessionClaims?.metadata.role === role
}

export const ROLES = ["admin", "moderator", "scrapper"] as const
export type Role = (typeof ROLES)[number]

export function isValidRole(v: any): v is Role {
  return ROLES.includes(v)
}
