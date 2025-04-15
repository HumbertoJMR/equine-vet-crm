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
import type { Propietario } from "@/lib/types"

interface PropietarioFormProps {
  propietario?: Propietario
  onSuccess?: () => void
}

export function PropietarioForm({ propietario, onSuccess }: PropietarioFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addPropietario, updatePropietario } = useStore()

  const [formData, setFormData] = useState({
    nombre: propietario?.nombre || "",
    telefono: propietario?.telefono || "",
    email: propietario?.email || "",
    direccion: propietario?.direccion || "",
    cedula: propietario?.cedula || "",
    rif: propietario?.rif || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.nombre || !formData.telefono || !formData.email) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      if (propietario) {
        // Actualizar propietario existente
        updatePropietario(propietario.id, formData)
        toast({
          title: "Propietario actualizado",
          description: `${formData.nombre} ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo propietario
        addPropietario(formData)
        toast({
          title: "Propietario agregado",
          description: `${formData.nombre} ha sido agregado correctamente.`,
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/propietarios")
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
          <Label htmlFor="telefono">
            Teléfono <span className="text-red-500">*</span>
          </Label>
          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rif">RIF</Label>
          <Input id="rif" name="rif" value={formData.rif} onChange={handleChange} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Textarea id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} rows={3} />
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
          {isSubmitting ? "Guardando..." : propietario ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
