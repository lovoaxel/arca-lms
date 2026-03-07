"use client";

import { createContext, useContext, type ReactNode } from 'react';
import type { Tenant } from '@/types/tenant';
import { DEFAULT_TENANT } from './resolver';

const TenantContext = createContext<Tenant>(DEFAULT_TENANT);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: Tenant;
  children: ReactNode;
}) {
  return (
    <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
  );
}

export function useTenant(): Tenant {
  return useContext(TenantContext);
}
