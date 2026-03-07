'use client'

import React, { createContext, useContext } from 'react'
import { Tenant } from '@/types/tenant'
import { DEFAULT_TENANT } from './resolver'

const TenantContext = createContext<Tenant>(DEFAULT_TENANT)

interface TenantProviderProps {
  children: React.ReactNode
  tenant?: Tenant
}

export function TenantProvider({ children, tenant = DEFAULT_TENANT }: TenantProviderProps) {
  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant(): Tenant {
  return useContext(TenantContext)
}

export { TenantContext }
