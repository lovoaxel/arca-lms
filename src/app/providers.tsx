"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { TenantProvider } from "@/lib/tenant/context";
import { DEFAULT_TENANT } from "@/lib/tenant/resolver";
import type { Tenant } from "@/types/tenant";

export function Providers({
  children,
  session,
  tenant,
}: {
  children: React.ReactNode;
  session?: Session | null;
  tenant?: Tenant;
}) {
  return (
    <SessionProvider session={session}>
      <TenantProvider tenant={tenant ?? DEFAULT_TENANT}>
        {children}
      </TenantProvider>
    </SessionProvider>
  );
}
