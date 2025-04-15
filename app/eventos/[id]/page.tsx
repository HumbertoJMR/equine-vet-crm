"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Calendar,
  FileText,
  Edit,
  User,
  MapPin,
  Clock,
  Plus,
  Trash2,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HistoriaForm } from "@/components/forms/historia-form"
import { CitaForm } from "@/components/forms/cita-form"
import { EventoForm } from "@/components/forms/evento-form"
import { useToast } from "@/hooks/use-toast"

export default function DetalleEvento({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    getEvento,
    getHistoriasEvento,
    getCitasEvento,
    getFacturasEvento,
    getCaballo,
    getPropietario,
    deleteHistoriaClinica,
    deleteCita,
    deleteEvento,
    getEventoStats,
  } = useStore()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isHistoriaDialogOpen, setIsHistoriaDialogOpen] = useState(false)
  const [isCitaDialogOpen, setIsCitaDialogOpen] = useState(false)

  // Obtener datos del evento
  const evento = getEvento(params.id)

  // Si no existe el evento, redirigir a la lista
  if (!evento) {
    router.push("/eventos")
    return null
  }

  // Obtener datos relacionados
  const historiasClinicas = getHistoriasEvento(evento.id)
  const citas = getCitasEvento(evento.id)
  const facturas = getFacturasEvento(evento.id)
  const stats = getEventoStats(evento.id)

  // Ordenar historias clínicas por fecha (más reciente primero)
  const historiasOrdenadas = [...historiasClinicas].sort((a, b) => {
    const fechaA = new Date(a.fecha.split(" ").reverse().join("-"))
    const fechaB = new Date(b.fecha.split(" ").reverse().join("-"))
    return fechaB.getTime() - fechaA.getTime()
  })

  // Filtrar citas pendientes (no completadas)
  const citasPendientes = citas
    .filter((cita) => !cita.completada)
    .sort((a, b) => {
      const fechaA = new Date(a.fecha.split(" ").reverse().join("-"))
      const fechaB = new Date(b.fecha.split(" ").reverse().join("-"))
      return fechaA.getTime() - fechaB.getTime()
    })

  // Eliminar historia clínica
  const handleDeleteHistoria = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta historia clínica?")) {
      deleteHistoriaClinica(id)
      toast({
        title: "Historia eliminada",
        description: "La historia clínica ha sido eliminada correctamente",
      })
    }
  }

  // Eliminar cita
  const handleDeleteCita = (id: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      deleteCita(id)
      toast({
        title: "Cita cancelada",
        description: "La cita ha sido cancelada correctamente",
      })
    }
  }

  // Eliminar evento
  const handleDeleteEvento = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar este evento? Se eliminarán también todas las historias clínicas y citas asociadas.",
      )
    ) {
      deleteEvento(evento.id)
      toast({
        title: "Evento eliminado",
        description: "El evento y sus datos asociados han sido eliminados",
      })
      router.push("/eventos")
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
      <div className="mb-6">
        <Link href="/eventos" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a Eventos
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{evento.nombre}</h1>
              {getEstadoBadge(evento.estado)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {getTipoBadge(evento.tipo)}
              <span className="text-muted-foreground">
                {evento.fecha}
                {evento.fechaFin && ` al ${evento.fechaFin}`}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="mr-2 h-4 w-4" /> Editar Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Editar Evento</DialogTitle>
                </DialogHeader>
                <EventoForm evento={evento} onSuccess={() => setIsEditDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="text-red-500" onClick={handleDeleteEvento}>
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="historias">Historias Clínicas</TabsTrigger>
          <TabsTrigger value="citas">Citas</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Datos del Evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium">Tipo:</dt>
                    <dd>{getTipoBadge(evento.tipo)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Estado:</dt>
                    <dd>{getEstadoBadge(evento.estado)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Fecha:</dt>
                    <dd>
                      {evento.fecha}
                      {evento.fechaFin && ` al ${evento.fechaFin}`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Ubicación:</dt>
                    <dd>{evento.ubicacion}</dd>
                  </div>
                  {evento.organizador && (
                    <div className="flex justify-between">
                      <dt className="font-medium">Organizador:</dt>
                      <dd>{evento.organizador}</dd>
                    </div>
                  )}
                  {evento.contacto && (
                    <div className="flex justify-between">
                      <dt className="font-medium">Contacto:</dt>
                      <dd>{evento.contacto}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Descripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{evento.descripcion || "No hay descripción disponible"}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-2xl font-bold">{stats.totalCaballos}</span>
                    <span className="text-sm text-muted-foreground">Caballos atendidos</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <FileText className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-2xl font-bold">{stats.totalServicios}</span>
                    <span className="text-sm text-muted-foreground">Servicios realizados</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <DollarSign className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-2xl font-bold">${stats.totalIngresos.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">Ingresos totales</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historias">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Historias Clínicas
              </CardTitle>

              <Dialog open={isHistoriaDialogOpen} onOpenChange={setIsHistoriaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Historia
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Registrar Nueva Historia Clínica</DialogTitle>
                  </DialogHeader>
                  <HistoriaForm eventoId={evento.id} onSuccess={() => setIsHistoriaDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {historiasOrdenadas.length > 0 ? (
                <div className="space-y-6">
                  {historiasOrdenadas.map((historia) => {
                    const caballo = getCaballo(historia.caballoId)
                    return (
                      <div key={historia.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                            <h3 className="font-medium">{caballo?.nombre || "Caballo no encontrado"}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{historia.fecha}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 h-8 w-8"
                              onClick={() => handleDeleteHistoria(historia.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {historia.tipo} - Veterinario: {historia.veterinario}
                        </p>
                        <p className="text-sm">{historia.notas}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">Sin historias clínicas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Este evento no tiene historias clínicas registradas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="citas">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Citas
              </CardTitle>

              <Dialog open={isCitaDialogOpen} onOpenChange={setIsCitaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Agendar Cita
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Agendar Nueva Cita</DialogTitle>
                  </DialogHeader>
                  <CitaForm eventoId={evento.id} onSuccess={() => setIsCitaDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {citasPendientes.length > 0 ? (
                <div className="space-y-4">
                  {citasPendientes.map((cita) => {
                    const caballo = getCaballo(cita.caballoId)
                    return (
                      <div key={cita.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Calendar className="h-10 w-10 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{caballo?.nombre || "Caballo no encontrado"}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {cita.fecha}, {cita.hora}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{cita.ubicacion}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDeleteCita(cita.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">Sin citas programadas</h3>
                  <p className="text-sm text-muted-foreground mb-4">Este evento no tiene citas pendientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Estadísticas del Evento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Servicios más comunes</h3>
                  {stats.serviciosMasComunes.length > 0 ? (
                    <div className="space-y-4">
                      {stats.serviciosMasComunes.map((servicio, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{servicio.nombre}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${(servicio.cantidad / stats.serviciosMasComunes[0].cantidad) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{servicio.cantidad}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay datos disponibles</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-4">Resumen financiero</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Ingresos totales</p>
                        <p className="text-2xl font-bold">${stats.totalIngresos.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-10 w-10 text-green-500" />
                    </div>
                    <div className="flex justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Caballos atendidos</p>
                        <p className="text-2xl font-bold">{stats.totalCaballos}</p>
                      </div>
                      <Users className="h-10 w-10 text-blue-500" />
                    </div>
                    <div className="flex justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Promedio por caballo</p>
                        <p className="text-2xl font-bold">
                          ${stats.totalCaballos > 0 ? (stats.totalIngresos / stats.totalCaballos).toFixed(2) : "0.00"}
                        </p>
                      </div>
                      <User className="h-10 w-10 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
