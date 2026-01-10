"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils"; // Utilitário padrão do shadcn

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produtos", icon: Package },
  { href: "/sales", label: "Vendas", icon: ShoppingCart },
  { href: "/categories", label: "Categorias", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r bg-slate-950 text-white p-6">
      {/* Logo */}
      <div>
        <div className="mb-8 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500" />
          <h1 className="text-xl font-bold tracking-tight">Apollo Admin</h1>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer da Sidebar */}
      <div className="border-t border-slate-800 pt-6">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
}