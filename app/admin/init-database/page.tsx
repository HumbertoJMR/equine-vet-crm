"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InitDatabasePage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initDatabase = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/init-database")
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError("Error al inicializar la base de datos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Inicialización de la Base de Datos</CardTitle>
          <CardDescription>Crea los datos iniciales necesarios para comenzar a usar el sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Este proceso creará datos de ejemplo en la base de datos. Solo es necesario ejecutarlo una vez cuando
              configuras el sistema por primera vez.
            </AlertDescription>
          </Alert>

          {status && (
            <div className={`p-4 rounded-md ${status.success ? "bg-green-50" : "bg-red-50"}`}>
              <div className="flex items-center">
                {status.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span className="font-medium">{status.message}</span>
              </div>
              {status.details && <p className="mt-2 text-sm">{status.details}</p>}
              {status.error && <p className="mt-2 text-sm text-red-600">{status.error}</p>}
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-600">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">¿Qué se creará?</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Clínica principal (Equinmedical Group)</li>
              <li>Usuario administrador (admin@equinmedical.com)</li>
              <li>Veterinario de ejemplo</li>
              <li>Servicios básicos</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={initDatabase} disabled={loading}>
            {loading ? (
              <>
                <Database className="h-4 w-4 mr-2 animate-pulse" />
                Inicializando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Inicializar Base de Datos
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
