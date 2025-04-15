"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ServicioForm } from "@/components/forms/servicio-form"
import { useToast } from "@/hooks/use-toast"

export default function Servicios() {
  const { servicios, searchServicios, deleteServicio } = useStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingServicio, setEditingServicio] = useState<string | null>(null)

  // Filtrar servicios según la búsqueda
  const filteredServicios = searchQuery
    ? searchServicios(searchQuery)
    : [...servicios].sort((a, b) => a.nombre.localeCompare(b.nombre))

  // Editar servicio
  const handleEdit = (id: string) => {
    setEditingServicio(id)
    setIsDialogOpen(true)
  }

  // Eliminar servicio
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      deleteServicio(id)
      toast({
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado correctamente",
      })
    }
  }

  // Cerrar diálogo y resetear estado
  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingServicio(null)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
          <p className="text-muted-foreground">Gestiona los servicios y procedimientos ofrecidos</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar servicio..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingServicio ? "Editar Servicio" : "Agregar Nuevo Servicio"}</DialogTitle>
              </DialogHeader>
              <ServicioForm
                servicio={editingServicio ? servicios.find((s) => s.id === editingServicio) : undefined}
                onSuccess={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Servicios Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServicios.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Categoría</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServicios.map((servicio) => (
                    <TableRow key={servicio.id}>
                      <TableCell className="font-medium">{servicio.nombre}</TableCell>
                      <TableCell>{servicio.descripcion}</TableCell>
                      <TableCell className="text-right">${servicio.precio.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{servicio.categoria}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(servicio.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDelete(servicio.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No se encontraron servicios</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Intenta con otra búsqueda" : "Agrega un nuevo servicio para comenzar"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
