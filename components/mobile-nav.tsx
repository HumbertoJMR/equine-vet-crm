"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DogIcon as Horse, Menu, Home, FileText, Receipt, Calendar, Package2, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/caballos", label: "Caballos", icon: Horse },
    { href: "/propietarios", label: "Propietarios", icon: Users },
    { href: "/historias-clinicas", label: "Historias Clínicas", icon: FileText },
    { href: "/facturas", label: "Facturas", icon: Receipt },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/eventos", label: "Eventos", icon: TrendingUp },
    { href: "/servicios", label: "Servicios", icon: FileText }, // Añadir esta línea
    { href: "/inventario", label: "Inventario", icon: Package2 },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <div className="flex items-center gap-2 mb-8">
          <Horse className="h-6 w-6" />
          <span className="text-xl font-bold">VetEquine CRM</span>
        </div>
        <nav className="flex flex-col gap-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center px-2 py-3 text-lg font-medium rounded-md hover:bg-muted transition-colors ${
                pathname === route.href ? "bg-muted" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              <route.icon className="h-5 w-5 mr-3" />
              {route.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
