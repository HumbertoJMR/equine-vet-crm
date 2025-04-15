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
import type { Servicio } from "@/lib/types"

interface ServicioFormProps {
  servicio?: Servicio
  onSuccess?: () => void
}

export function ServicioForm({ servicio, onSuccess }: ServicioFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addServicio, updateServicio } = useStore()

  const [formData, setFormData] = useState({
    nombre: servicio?.nombre || "",
    descripcion: servicio?.descripcion || "",
    precio: servicio?.precio?.toString() || "",
    categoria: servicio?.categoria || "consulta",
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
      if (!formData.nombre || !formData.precio) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      const servicioData = {
        ...formData,
        precio: Number.parseFloat(formData.precio) || 0,
      }

      if (servicio) {
        // Actualizar servicio existente
        updateServicio(servicio.id, servicioData)
        toast({
          title: "Servicio actualizado",
          description: `${formData.nombre} ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo servicio
        addServicio(servicioData)
        toast({
          title: "Servicio agregado",
          description: `${formData.nombre} ha sido agregado correctamente.`,
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/servicios")
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
          <Label htmlFor="precio">
            Precio <span className="text-red-500">*</span>
          </Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consulta">Consulta</SelectItem>
              <SelectItem value="procedimiento">Procedimiento</SelectItem>
              <SelectItem value="cirugia">Cirugía</SelectItem>
              <SelectItem value="laboratorio">Laboratorio</SelectItem>
              <SelectItem value="medicamento">Medicamento</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
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
          {isSubmitting ? "Guardando..." : servicio ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
