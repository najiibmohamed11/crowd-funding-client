'use client'

import { usePathname } from 'next/navigation'
import { LayoutGrid, FileText, BarChart3, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import Image from 'next/image'
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "@/app/client";

export function DashboardSidebar() {
  const pathname = usePathname();
  const account = useActiveAccount();
  const { data: oracleAddress } = useReadContract({
    contract,
    method: "function oracle() view returns (address)",
    params: [],
  });

  const isOracle =
    account?.address &&
    oracleAddress &&
    account.address.toLowerCase() === oracleAddress.toLowerCase();

  const links = [
    { href: "/dashboard", icon: LayoutGrid },
    { href: "/dashboard/create-campaign", icon: FileText },
    // { href: '/dashboard/analytics', icon: BarChart3 },
    { href: "/dashboard/profile", icon: Users },
  ];
  if (isOracle) {
    links.push({ href: "/dashboard/settings", icon: BarChart3 }); // Use BarChart3 or a new icon for approval
  }

  return (
    <aside className="w-[80px] min-h-screen bg-transparent flex flex-col items-center py-8">
       <Link href="/">
          <div className="flex-shrink-0">
            <Image
              src='/light-logo.svg'
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
        </Link>
      <nav className="flex flex-col gap-12 py-6">
        {links.map(({ href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
              pathname === href ? "bg-red-50" : "hover:bg-gray-100"
            )}
          >
            <Icon
              className={clsx(
                "w-5 h-5",
                pathname === href ? "text-red-500" : "text-gray-400"
              )}
            />
          </Link>
        ))}
      </nav>
    </aside>
  )
}
