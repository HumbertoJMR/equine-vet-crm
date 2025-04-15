"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Cita } from "@/lib/types"

interface CitaFormProps {
  cita?: Cita
  caballoId?: string
  eventoId?: string
  onSuccess?: () => void
}

export function CitaForm({ cita, caballoId, eventoId, onSuccess }: CitaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addCita, updateCita, caballos, caballerizas, eventos } = useStore()

  const [formData, setFormData] = useState({
    caballoId: cita?.caballoId || caballoId || "",
    fecha: cita?.fecha || "",
    hora: cita?.hora || "",
    tipo: cita?.tipo || "",
    ubicacion: cita?.ubicacion || "",
    notas: cita?.notas || "",
    completada: cita?.completada || false,
    eventoId: cita?.eventoId || eventoId || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.caballoId || !formData.fecha || !formData.hora || !formData.tipo) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      // Formatear fecha para mostrar
      const fecha = new Date(formData.fecha)
      const fechaFormateada = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })

      if (cita) {
        // Actualizar cita existente
        updateCita(cita.id, {
          ...formData,
          fecha: fechaFormateada,
        })
        toast({
          title: "Cita actualizada",
          description: "La cita ha sido actualizada correctamente.",
        })
      } else {
        // Crear nueva cita
        addCita({
          ...formData,
          fecha: fechaFormateada,
        })
        toast({
          title: "Cita agendada",
          description: "La cita ha sido agendada correctamente.",
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/agenda")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="caballoId">
            Caballo <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.caballoId}
            onValueChange={(value) => handleSelectChange("caballoId", value)}
            disabled={!!caballoId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar caballo" />
            </SelectTrigger>
            <SelectContent>
              {caballos.map((caballo) => (
                <SelectItem key={caballo.id} value={caballo.id}>
                  {caballo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha">
              Fecha <span className="text-red-500">*</span>
            </Label>
            <Input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora">
              Hora <span className="text-red-500">*</span>
            </Label>
            <Input id="hora" name="hora" type="time" value={formData.hora} onChange={handleChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">
            Tipo de cita <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Revisión General">Revisión General</SelectItem>
              <SelectItem value="Vacunación">Vacunación</SelectItem>
              <SelectItem value="Tratamiento">Tratamiento</SelectItem>
              <SelectItem value="Revisión Dental">Revisión Dental</SelectItem>
              <SelectItem value="Herraje">Herraje</SelectItem>
              <SelectItem value="Control">Control</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion">
            Ubicación <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.ubicacion} onValueChange={(value) => handleSelectChange("ubicacion", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar ubicación" />
            </SelectTrigger>
            <SelectContent>
              {caballerizas.map((caballeriza) => (
                <SelectItem key={caballeriza.id} value={caballeriza.nombre}>
                  {caballeriza.nombre}
                </SelectItem>
              ))}
              <SelectItem value="Consultorio">Consultorio</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventoId">Evento asociado</Label>
          <Select
            value={formData.eventoId}
            onValueChange={(value) => handleSelectChange("eventoId", value)}
            disabled={!!eventoId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar evento (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Ninguno</SelectItem>
              {eventos.map((evento) => (
                <SelectItem key={evento.id} value={evento.id}>
                  {evento.nombre} ({evento.fecha})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notas">Notas adicionales</Label>
          <Textarea id="notas" name="notas" value={formData.notas} onChange={handleChange} rows={3} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault()
            if (onSuccess) {
              onSuccess()
            }
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : cita ? "Actualizar Cita" : "Agendar Cita"}
        </Button>
      </div>
    </form>
  )
}
