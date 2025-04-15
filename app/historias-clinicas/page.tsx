"use client"

import { useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileText, ChevronRight, Receipt } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HistoriaForm } from "@/components/forms/historia-form"
import { useRouter } from "next/navigation"

export default function HistoriasClinicas() {
  const router = useRouter()
  const { historiasClinicas, caballos, searchHistorias } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filtrar historias clínicas según la búsqueda
  const filteredHistorias = searchQuery
    ? searchHistorias(searchQuery)
    : [...historiasClinicas].sort((a, b) => {
        // Ordenar por fecha (más reciente primero)
        const fechaA = new Date(a.fecha.split(" ").reverse().join("-"))
        const fechaB = new Date(b.fecha.split(" ").reverse().join("-"))
        return fechaB.getTime() - fechaA.getTime()
      })

  const handleHistoriaSuccess = (historiaId: string) => {
    setIsDialogOpen(false)
    // Redirigir a la página de factura
    router.push(`/facturas/${historiaId}`)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historias Clínicas</h1>
          <p className="text-muted-foreground">Gestiona los registros médicos de los caballos</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar historia clínica..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nueva Historia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Historia Clínica</DialogTitle>
              </DialogHeader>
              <HistoriaForm onSuccess={handleHistoriaSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Historias Clínicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistorias.length > 0 ? (
            <div className="space-y-4">
              {filteredHistorias.map((historia) => {
                const caballo = caballos.find((c) => c.id === historia.caballoId)
                return (
                  <div
                    key={historia.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{caballo?.nombre || "Caballo no encontrado"}</p>
                        <p className="text-sm text-muted-foreground">
                          {historia.tipo} - {historia.fecha}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground hidden md:inline">{historia.veterinario}</span>
                      <div className="flex items-center gap-2">
                        {historia.facturaGenerada && (
                          <Link href={`/facturas/${historia.facturaId}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Receipt className="h-4 w-4" />
                              <span className="hidden sm:inline">Ver Factura</span>
                            </Button>
                          </Link>
                        )}
                        <Link href={`/caballos/${caballo?.id}`}>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No se encontraron historias clínicas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Intenta con otra búsqueda" : "Registra una nueva historia clínica para comenzar"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
