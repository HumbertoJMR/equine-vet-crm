"use client"

import { useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, ChevronRight, HopIcon as HorseshoeIcon, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CaballoForm } from "@/components/forms/caballo-form"
import { useToast } from "@/hooks/use-toast"

export default function Caballos() {
  const { caballos, searchCaballos, deleteCaballo, propietarios, caballerizas } = useStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filtrar caballos según la búsqueda
  const filteredCaballos = searchQuery
    ? searchCaballos(searchQuery)
    : [...caballos].sort((a, b) => a.nombre.localeCompare(b.nombre))

  // Eliminar caballo
  const handleDelete = (id: string) => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar este caballo? Se eliminarán también todas sus historias clínicas y citas asociadas.",
      )
    ) {
      deleteCaballo(id)
      toast({
        title: "Caballo eliminado",
        description: "El caballo y sus datos asociados han sido eliminados",
      })
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caballos</h1>
          <p className="text-muted-foreground">Gestiona los perfiles de los ejemplares</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar caballo..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Caballo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Caballo</DialogTitle>
              </DialogHeader>
              <CaballoForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HorseshoeIcon className="h-5 w-5 mr-2 text-primary" />
            Caballos Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCaballos.length > 0 ? (
            <div className="space-y-4">
              {filteredCaballos.map((caballo) => {
                const propietario = propietarios.find((p) => p.id === caballo.propietarioId)
                const caballeriza = caballerizas.find((c) => c.id === caballo.caballerizaId)

                return (
                  <div
                    key={caballo.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-lg text-primary">{caballo.nombre.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{caballo.nombre}</p>
                          <Badge variant="outline">{caballo.raza}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {caballo.edad} años • Dueño: {propietario?.nombre || "No asignado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm">{caballeriza?.nombre || "No asignada"}</p>
                        <p className="text-sm text-muted-foreground">
                          Última revisión: {caballo.ultimaRevision || "Sin revisiones"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDelete(caballo.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Link href={`/caballos/${caballo.id}`}>
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
              <HorseshoeIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No se encontraron caballos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Intenta con otra búsqueda" : "Registra un nuevo caballo para comenzar"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
