"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, ChevronLeft, ChevronRight, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CitaForm } from "@/components/forms/cita-form"
import { useToast } from "@/hooks/use-toast"

export default function Agenda() {
  const { citas, caballos, updateCita, deleteCita } = useStore()
  const { toast } = useToast()

  // Estado para el diálogo de nueva cita
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Estado para la vista (día, semana, mes)
  const [vista, setVista] = useState("semana")

  // Estado para la semana actual
  const [semanaActual, setSemanaActual] = useState(new Date())

  // Calcular días de la semana actual
  const obtenerDiasSemana = (fecha: Date) => {
    const inicio = new Date(fecha)
    inicio.setDate(inicio.getDate() - inicio.getDay() + 1) // Lunes

    const dias = []
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicio)
      dia.setDate(inicio.getDate() + i)
      dias.push(dia)
    }

    return dias
  }

  const diasSemana = obtenerDiasSemana(semanaActual)

  // Formatear fechas
  const formatearDia = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", { weekday: "long" })
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
  }

  // Formatear rango de fechas para el título
  const formatearRangoSemana = () => {
    const inicio = diasSemana[0]
    const fin = diasSemana[6]

    const mesInicio = inicio.toLocaleDateString("es-ES", { month: "long" })
    const mesFin = fin.toLocaleDateString("es-ES", { month: "long" })

    if (mesInicio === mesFin) {
      return `${inicio.getDate()} al ${fin.getDate()} de ${mesInicio}, ${inicio.getFullYear()}`
    } else {
      return `${inicio.getDate()} de ${mesInicio} al ${fin.getDate()} de ${mesFin}, ${inicio.getFullYear()}`
    }
  }

  // Navegar entre semanas
  const semanaAnterior = () => {
    const nuevaFecha = new Date(semanaActual)
    nuevaFecha.setDate(nuevaFecha.getDate() - 7)
    setSemanaActual(nuevaFecha)
  }

  const semanaActualFn = () => {
    setSemanaActual(new Date())
  }

  const semanaSiguiente = () => {
    const nuevaFecha = new Date(semanaActual)
    nuevaFecha.setDate(nuevaFecha.getDate() + 7)
    setSemanaActual(nuevaFecha)
  }

  // Horarios de trabajo
  const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  // Marcar cita como completada
  const marcarCompletada = (id: string) => {
    updateCita(id, { completada: true })
    toast({
      title: "Cita completada",
      description: "La cita ha sido marcada como completada",
    })
  }

  // Cancelar cita
  const cancelarCita = (id: string) => {
    deleteCita(id)
    toast({
      title: "Cita cancelada",
      description: "La cita ha sido cancelada correctamente",
    })
  }

  // Filtrar citas para la semana actual
  const citasSemana = citas.filter((cita) => {
    // Convertir la fecha de la cita a objeto Date
    const partesFecha = cita.fecha.split(" ")
    const dia = Number.parseInt(partesFecha[0])
    const mes = partesFecha[1]
    const año = Number.parseInt(partesFecha[2])

    // Mapeo de abreviaturas de mes a número
    const meses: { [key: string]: number } = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    }

    const fechaCita = new Date(año, meses[mes.toLowerCase()], dia)

    // Verificar si la fecha está en la semana actual
    return diasSemana.some(
      (dia) =>
        dia.getDate() === fechaCita.getDate() &&
        dia.getMonth() === fechaCita.getMonth() &&
        dia.getFullYear() === fechaCita.getFullYear(),
    )
  })

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">Gestiona tus citas y visitas programadas</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Select value={vista} onValueChange={setVista}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ver por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Día</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Agendar Nueva Cita</DialogTitle>
              </DialogHeader>
              <CitaForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Semana del {formatearRangoSemana()}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={semanaAnterior}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={semanaActualFn}>
                Hoy
              </Button>
              <Button variant="outline" size="sm" onClick={semanaSiguiente}>
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {diasSemana.map((dia, index) => (
              <div key={index} className="text-center font-medium p-2">
                <div className="capitalize">{formatearDia(dia)}</div>
                <div className="text-sm text-muted-foreground">{formatearFecha(dia)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 relative">
            <div className="grid grid-cols-7 gap-1 border-t">
              {diasSemana.map((dia, diaIndex) => (
                <div key={diaIndex} className="min-h-[600px] border-r relative">
                  {horarios.map((hora, horaIndex) => (
                    <div key={hora} className="h-[60px] border-b text-xs text-muted-foreground pl-1">
                      {hora}
                    </div>
                  ))}

                  {/* Renderizar citas para este día */}
                  {citasSemana
                    .filter((cita) => {
                      // Convertir la fecha de la cita a objeto Date
                      const partesFecha = cita.fecha.split(" ")
                      const diaCita = Number.parseInt(partesFecha[0])
                      const mesCita = partesFecha[1]
                      const añoCita = Number.parseInt(partesFecha[2])

                      // Mapeo de abreviaturas de mes a número
                      const meses: { [key: string]: number } = {
                        ene: 0,
                        feb: 1,
                        mar: 2,
                        abr: 3,
                        may: 4,
                        jun: 5,
                        jul: 6,
                        ago: 7,
                        sep: 8,
                        oct: 9,
                        nov: 10,
                        dic: 11,
                      }

                      const fechaCita = new Date(añoCita, meses[mesCita.toLowerCase()], diaCita)

                      // Verificar si la cita es para este día
                      return (
                        dia.getDate() === fechaCita.getDate() &&
                        dia.getMonth() === fechaCita.getMonth() &&
                        dia.getFullYear() === fechaCita.getFullYear()
                      )
                    })
                    .map((cita) => {
                      // Calcular posición basada en la hora
                      const [hora, minutos] = cita.hora.split(":").map(Number)
                      const horaIndex = horarios.findIndex((h) => Number.parseInt(h) === hora)
                      const top = horaIndex * 60 + (minutos / 60) * 60

                      // Obtener datos del caballo
                      const caballo = caballos.find((c) => c.id === cita.caballoId)

                      // Determinar color según estado
                      const colorClase = cita.completada
                        ? "bg-green-100 border-green-200"
                        : "bg-blue-100 border-blue-200"

                      return (
                        <div
                          key={cita.id}
                          className={`absolute left-0 right-0 mx-1 p-2 rounded-md border ${colorClase} group hover:shadow-md transition-all`}
                          style={{ top: `${top}px`, height: "60px" }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="overflow-hidden">
                              <p className="font-medium text-xs truncate">
                                {caballo?.nombre || "Caballo no encontrado"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{cita.tipo}</p>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate">{cita.ubicacion}</span>
                              </div>
                            </div>

                            {/* Acciones - visible en hover */}
                            <div className="hidden group-hover:flex gap-1">
                              {!cita.completada && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-green-500"
                                    onClick={() => marcarCompletada(cita.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-red-500"
                                    onClick={() => cancelarCita(cita.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
