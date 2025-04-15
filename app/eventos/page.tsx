"use client"

import { useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, Calendar, MapPin, Clock, Trash2, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EventoForm } from "@/components/forms/evento-form"
import { useToast } from "@/hooks/use-toast"

export default function Eventos() {
  const { eventos, searchEventos, deleteEvento } = useStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filtrar eventos según la búsqueda
  const filteredEventos = searchQuery
    ? searchEventos(searchQuery)
    : [...eventos].sort((a, b) => {
        // Ordenar por fecha (más reciente primero)
        const fechaA = new Date(a.fecha.split(" ").reverse().join("-"))
        const fechaB = new Date(b.fecha.split(" ").reverse().join("-"))
        return fechaB.getTime() - fechaA.getTime()
      })

  // Eliminar evento
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      deleteEvento(id)
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado correctamente",
      })
    }
  }

  // Obtener etiqueta de estado
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "programado":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Programado</Badge>
      case "en_curso":
        return <Badge className="bg-green-100 text-green-800 border-green-200">En curso</Badge>
      case "finalizado":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Finalizado</Badge>
      case "cancelado":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  // Obtener etiqueta de tipo
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "competencia":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Competencia</Badge>
      case "exposicion":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Exposición</Badge>
      case "clinica":
        return <Badge className="bg-teal-100 text-teal-800 border-teal-200">Clínica</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">Gestiona eventos, competencias y exposiciones</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar evento..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Evento</DialogTitle>
              </DialogHeader>
              <EventoForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEventos.length > 0 ? (
            <div className="space-y-4">
              {filteredEventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{evento.nombre}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {evento.fecha}
                          {evento.fechaFin && ` al ${evento.fechaFin}`}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {evento.ubicacion}
                        </span>
                        <span className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" /> {getTipoBadge(evento.tipo)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>{getEstadoBadge(evento.estado)}</div>
                    <div className="flex items-center gap-2">
                      <Link href={`/eventos/${evento.id}`}>
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDelete(evento.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No se encontraron eventos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Intenta con otra búsqueda" : "Registra un nuevo evento para comenzar"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
