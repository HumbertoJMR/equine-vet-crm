"use client"

import { useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Receipt, ChevronRight, Printer } from "lucide-react"

export default function Facturas() {
  const { facturas, searchFacturas, getCaballo, getPropietario } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar facturas según la búsqueda
  const filteredFacturas = searchQuery
    ? searchFacturas(searchQuery)
    : [...facturas].sort((a, b) => {
        // Ordenar por fecha (más reciente primero)
        const fechaA = new Date(a.fecha.split(" ").reverse().join("-"))
        const fechaB = new Date(b.fecha.split(" ").reverse().join("-"))
        return fechaB.getTime() - fechaA.getTime()
      })

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturas</h1>
          <p className="text-muted-foreground">Gestiona las facturas generadas</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar factura..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-primary" />
            Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFacturas.length > 0 ? (
            <div className="space-y-4">
              {filteredFacturas.map((factura) => {
                const caballo = getCaballo(factura.caballoId)
                const propietario = getPropietario(factura.propietarioId)
                return (
                  <div
                    key={factura.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{factura.numero}</p>
                          <span className="text-sm text-muted-foreground">({factura.fecha})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {caballo?.nombre || "Caballo no encontrado"} -{" "}
                          {propietario?.nombre || "Propietario no encontrado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${factura.totalConIva.toFixed(2)}</span>
                      <Link href={`/facturas/${factura.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Printer className="h-4 w-4" />
                          <span className="hidden sm:inline">Ver Factura</span>
                        </Button>
                      </Link>
                      <Link href={`/facturas/${factura.id}`}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Receipt className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No se encontraron facturas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Intenta con otra búsqueda"
                  : "Registra una nueva historia clínica para generar facturas"}
              </p>
              <Link href="/historias-clinicas">
                <Button>Crear Historia Clínica</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
