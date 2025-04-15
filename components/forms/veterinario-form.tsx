"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Veterinario } from "@/lib/types"

interface VeterinarioFormProps {
  veterinario?: Veterinario
  onSuccess?: () => void
}

export function VeterinarioForm({ veterinario, onSuccess }: VeterinarioFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addVeterinario, updateVeterinario } = useStore()

  const [formData, setFormData] = useState({
    nombre: veterinario?.nombre || "",
    especialidad: veterinario?.especialidad || "",
    telefono: veterinario?.telefono || "",
    email: veterinario?.email || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.nombre) {
        throw new Error("Por favor ingrese el nombre del veterinario")
      }

      if (veterinario) {
        // Actualizar veterinario existente
        updateVeterinario(veterinario.id, formData)
        toast({
          title: "Veterinario actualizado",
          description: `${formData.nombre} ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo veterinario
        addVeterinario(formData)
        toast({
          title: "Veterinario agregado",
          description: `${formData.nombre} ha sido agregado correctamente.`,
        })
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/perfil?tab=veterinarios")
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
          <Label htmlFor="especialidad">Especialidad</Label>
          <Input id="especialidad" name="especialidad" value={formData.especialidad} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
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
          {isSubmitting ? "Guardando..." : veterinario ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
