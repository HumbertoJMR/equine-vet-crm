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
import type { Evento } from "@/lib/types"

interface EventoFormProps {
  evento?: Evento
  onSuccess?: () => void
}

export function EventoForm({ evento, onSuccess }: EventoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addEvento, updateEvento } = useStore()

  const [formData, setFormData] = useState({
    nombre: evento?.nombre || "",
    fecha: evento?.fecha || "",
    fechaFin: evento?.fechaFin || "",
    ubicacion: evento?.ubicacion || "",
    descripcion: evento?.descripcion || "",
    organizador: evento?.organizador || "",
    contacto: evento?.contacto || "",
    tipo: evento?.tipo || "competencia",
    estado: evento?.estado || "programado",
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
      if (!formData.nombre || !formData.fecha || !formData.ubicacion || !formData.tipo || !formData.estado) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      // Formatear fecha para mostrar
      const fecha = new Date(formData.fecha)
      const fechaFormateada = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })

      // Formatear fecha fin si existe
      let fechaFinFormateada = ""
      if (formData.fechaFin) {
        const fechaFin = new Date(formData.fechaFin)
        fechaFinFormateada = fechaFin.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      }

      if (evento) {
        // Actualizar evento existente
        updateEvento(evento.id, {
          ...formData,
          fecha: fechaFormateada,
          fechaFin: fechaFinFormateada || undefined,
        })
        toast({
          title: "Evento actualizado",
          description: `${formData.nombre} ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo evento
        addEvento({
          ...formData,
          fecha: fechaFormateada,
          fechaFin: fechaFinFormateada || undefined,
          servicios: [],
          caballosAtendidos: 0,
          ingresos: 0,
          gastos: 0,
        })
        toast({
          title: "Evento agregado",
          description: `${formData.nombre} ha sido agregado correctamente.`,
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/eventos")
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">
            Tipo <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="competencia">Competencia</SelectItem>
              <SelectItem value="exposicion">Exposición</SelectItem>
              <SelectItem value="clinica">Clínica</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha">
            Fecha de inicio <span className="text-red-500">*</span>
          </Label>
          <Input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaFin">Fecha de finalización</Label>
          <Input id="fechaFin" name="fechaFin" type="date" value={formData.fechaFin} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion">
            Ubicación <span className="text-red-500">*</span>
          </Label>
          <Input id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">
            Estado <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programado">Programado</SelectItem>
              <SelectItem value="en_curso">En curso</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizador">Organizador</Label>
          <Input id="organizador" name="organizador" value={formData.organizador} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto">Contacto</Label>
          <Input id="contacto" name="contacto" value={formData.contacto} onChange={handleChange} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} />
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
          {isSubmitting ? "Guardando..." : evento ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
