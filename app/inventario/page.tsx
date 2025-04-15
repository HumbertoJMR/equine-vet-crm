"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, AlertTriangle, Package2, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InventarioForm } from "@/components/forms/inventario-form"
import { useToast } from "@/hooks/use-toast"

export default function Inventario() {
  const { inventario, searchInventario, deleteInventarioItem } = useStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)

  // Filtrar inventario según la búsqueda
  const filteredInventario = searchQuery
    ? searchInventario(searchQuery)
    : [...inventario].sort((a, b) => {
        // Ordenar por stock bajo primero
        const aEsBajo = a.stock < a.minimo
        const bEsBajo = b.stock < b.minimo

        if (aEsBajo && !bEsBajo) return -1
        if (!aEsBajo && bEsBajo) return 1

        // Si ambos son bajos o ambos están bien, ordenar por nombre
        return a.nombre.localeCompare(b.nombre)
      })

  // Eliminar item
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este item?")) {
      deleteInventarioItem(id)
      toast({
        title: "Item eliminado",
        description: "El item ha sido eliminado del inventario",
      })
    }
  }

  // Editar item
  const handleEdit = (id: string) => {
    setEditingItem(id)
    setIsDialogOpen(true)
  }

  // Cerrar diálogo y resetear estado
  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestiona medicamentos e insumos</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en inventario..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Editar Item" : "Agregar Nuevo Item"}</DialogTitle>
              </DialogHeader>
              <InventarioForm
                item={editingItem ? inventario.find((i) => i.id === editingItem) : undefined}
                onSuccess={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package2 className="h-5 w-5 mr-2 text-primary" />
            Inventario Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInventario.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Mínimo</TableHead>
                    <TableHead className="text-right">Unidad</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventario.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nombre}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">{item.minimo}</TableCell>
                      <TableCell className="text-right">{item.unidad}</TableCell>
                      <TableCell className="text-right">
                        {item.stock < item.minimo ? (
                          <div className="flex items-center justify-end text-red-500">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>Bajo</span>
                          </div>
                        ) : (
                          <span className="text-green-500">OK</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDelete(item.id)}
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
              <Package2 className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No se encontraron items</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Intenta con otra búsqueda" : "Agrega un nuevo item para comenzar"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
