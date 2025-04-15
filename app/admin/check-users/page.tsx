"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function CheckUsersPage() {
  const [loading, setLoading] = useState(false)
  const [correcting, setCorrecting] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [correctionResult, setCorrectionResult] = useState<any>(null)
  const { toast } = useToast()

  const checkUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/check-users")
      const data = await response.json()
      setUserData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron verificar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const correctDuplicates = async () => {
    setCorrecting(true)
    try {
      const response = await fetch("/api/check-users", {
        method: "POST",
      })
      const data = await response.json()
      setCorrectionResult(data)
      toast({
        title: "Éxito",
        description: "Se han corregido los usuarios duplicados",
      })
      // Actualizar la lista de usuarios
      checkUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron corregir los usuarios duplicados",
        variant: "destructive",
      })
    } finally {
      setCorrecting(false)
    }
  }

  useEffect(() => {
    checkUsers()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Verificación de Usuarios</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado de Usuarios</CardTitle>
          <CardDescription>Verifica si hay usuarios duplicados en la base de datos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando información de usuarios...</p>
          ) : userData ? (
            <div className="space-y-4">
              <p>
                Total de usuarios: <strong>{userData.totalUsuarios}</strong>
              </p>
              <p>
                Emails únicos: <strong>{userData.emailsUnicos}</strong>
              </p>
              <p>
                Emails con duplicados: <strong>{Object.keys(userData.emailsConDuplicados).length}</strong>
              </p>

              {userData.hayDuplicados && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Usuarios duplicados:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {Object.entries(userData.emailsConDuplicados).map(([email, users]: [string, any]) => (
                      <li key={email}>
                        <strong>{email}</strong>: {users.length} usuarios
                        <ul className="list-circle pl-5 mt-1">
                          {users.map((user: any) => (
                            <li key={user.id}>
                              ID: {user.id}, Nombre: {user.nombre}, Rol: {user.rol}, Creado:{" "}
                              {new Date(user.created_at).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={checkUsers} disabled={loading}>
            {loading ? "Verificando..." : "Verificar Usuarios"}
          </Button>
          {userData?.hayDuplicados && (
            <Button onClick={correctDuplicates} disabled={correcting || loading} variant="destructive">
              {correcting ? "Corrigiendo..." : "Corregir Duplicados"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {correctionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado de la Corrección</CardTitle>
            <CardDescription>Detalles de los usuarios corregidos</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(correctionResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
