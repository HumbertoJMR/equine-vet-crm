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
  Pill,
  Edit,
  User,
  MapPin,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  HopIcon as HorseshoeIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HistoriaForm } from "@/components/forms/historia-form"
import { CitaForm } from "@/components/forms/cita-form"
import { CaballoForm } from "@/components/forms/caballo-form"
import { useToast } from "@/hooks/use-toast"

export default function DetalleCaballo({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    getCaballo,
    getHistoriasCaballo,
    getCitasCaballo,
    getPropietario,
    getCaballeriza,
    deleteHistoriaClinica,
    deleteCita,
    deleteCaballo,
  } = useStore()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isHistoriaDialogOpen, setIsHistoriaDialogOpen] = useState(false)
  const [isCitaDialogOpen, setIsCitaDialogOpen] = useState(false)

  // Obtener datos del caballo
  const caballo = getCaballo(params.id)

  // Si no existe el caballo, redirigir a la lista
  if (!caballo) {
    router.push("/caballos")
    return null
  }

  // Obtener datos relacionados
  const propietario = getPropietario(caballo.propietarioId)
  const caballeriza = getCaballeriza(caballo.caballerizaId)
  const historiasClinicas = getHistoriasCaballo(caballo.id)
  const citas = getCitasCaballo(caballo.id)

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

  // Eliminar caballo
  const handleDeleteCaballo = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar este caballo? Se eliminarán también todas sus historias clínicas y citas asociadas.",
      )
    ) {
      deleteCaballo(caballo.id)
      toast({
        title: "Caballo eliminado",
        description: "El caballo y sus datos asociados han sido eliminados",
      })
      router.push("/caballos")
    }
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/caballos" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a Caballos
        </Link>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-xl text-primary">{caballo.nombre.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{caballo.nombre}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{caballo.raza}</Badge>
                <span className="text-muted-foreground">{caballo.edad} años</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Editar Caballo</DialogTitle>
                </DialogHeader>
                <CaballoForm caballo={caballo} onSuccess={() => setIsEditDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="text-red-500" onClick={handleDeleteCaballo}>
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="historial">Historial Médico</TabsTrigger>
          <TabsTrigger value="citas">Citas</TabsTrigger>
          <TabsTrigger value="medicacion">Medicación</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HorseshoeIcon className="h-5 w-5 mr-2 text-primary" />
                  Datos Generales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium">Raza:</dt>
                    <dd>{caballo.raza}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Edad:</dt>
                    <dd>{caballo.edad} años</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Sexo:</dt>
                    <dd>{caballo.sexo}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Color:</dt>
                    <dd>{caballo.color}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Peso:</dt>
                    <dd>{caballo.peso}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Altura:</dt>
                    <dd>{caballo.altura}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Propietario y Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Propietario</h3>
                    </div>
                    <p>{propietario?.nombre || "No asignado"}</p>
                    <p className="text-sm text-muted-foreground">{propietario?.telefono || "Sin teléfono"}</p>
                    <p className="text-sm text-muted-foreground">{propietario?.email || "Sin email"}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Caballeriza</h3>
                    </div>
                    <p>{caballeriza?.nombre || "No asignada"}</p>
                    <p className="text-sm text-muted-foreground">{caballeriza?.direccion || "Sin dirección"}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Última Revisión</h3>
                    </div>
                    <p>{caballo.ultimaRevision || "Sin revisiones"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Historial Médico
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
                  <HistoriaForm caballoId={caballo.id} onSuccess={() => setIsHistoriaDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {historiasOrdenadas.length > 0 ? (
                <div className="space-y-6">
                  {historiasOrdenadas.map((historia) => (
                    <div key={historia.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <h3 className="font-medium">{historia.tipo}</h3>
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
                      <p className="text-sm text-muted-foreground mb-2">Veterinario: {historia.veterinario}</p>
                      <p className="text-sm">{historia.notas}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">Sin historias clínicas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Este caballo no tiene historias clínicas registradas
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
                Próximas Citas
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
                  <CitaForm caballoId={caballo.id} onSuccess={() => setIsCitaDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {citasPendientes.length > 0 ? (
                <div className="space-y-4">
                  {citasPendientes.map((cita) => (
                    <div key={cita.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Calendar className="h-10 w-10 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{cita.tipo}</p>
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
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">Sin citas programadas</h3>
                  <p className="text-sm text-muted-foreground mb-4">Este caballo no tiene citas pendientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicacion">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-primary" />
                Medicación Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {caballo.medicacionActual && caballo.medicacionActual.length > 0 ? (
                <div className="space-y-4">
                  {caballo.medicacionActual.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Pill className="h-10 w-10 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{med.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            Dosis: {med.dosis} - {med.frecuencia}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Período: {med.inicio} al {med.fin}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Modificar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">Sin medicación activa</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Este caballo no tiene medicación activa en este momento
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
