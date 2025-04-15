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
import type { Caballeriza } from "@/lib/types"

interface CaballerizaFormProps {
  caballeriza?: Caballeriza
  onSuccess?: () => void
}

export function CaballerizaForm({ caballeriza, onSuccess }: CaballerizaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addCaballeriza, updateCaballeriza } = useStore()

  const [formData, setFormData] = useState({
    nombre: caballeriza?.nombre || "",
    direccion: caballeriza?.direccion || "",
    telefono: caballeriza?.telefono || "",
    contacto: caballeriza?.contacto || "",
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
      if (!formData.nombre || !formData.direccion) {
        throw new Error("Por favor complete los campos obligatorios")
      }

      if (caballeriza) {
        // Actualizar caballeriza existente
        updateCaballeriza(caballeriza.id, formData)
        toast({
          title: "Caballeriza actualizada",
          description: `${formData.nombre} ha sido actualizada correctamente.`,
        })
      } else {
        // Crear nueva caballeriza
        addCaballeriza(formData)
        toast({
          title: "Caballeriza agregada",
          description: `${formData.nombre} ha sido agregada correctamente.`,
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
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto">Persona de contacto</Label>
          <Input id="contacto" name="contacto" value={formData.contacto} onChange={handleChange} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="direccion">
            Dirección <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            rows={3}
            required
          />
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
          {isSubmitting ? "Guardando..." : caballeriza ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
