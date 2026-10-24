"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()

    if (normalizedEmail !== "admin@renthub.com" || normalizedPassword !== "admin123") {
      setError("Invalid credentials. Use admin@renthub.com / admin123")
      return
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("renthub-admin-auth", "true")
    }

    setIsLoading(true)
    window.setTimeout(() => {
      router.push("/admin/dashboard")
      setIsLoading(false)
    }, 300)
  }

  const handleDemoFill = () => {
    setEmail("admin@renthub.com")
    setPassword("admin123")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">RentHub</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Administrator Login</h2>
          <p className="mt-2 text-gray-600">Sign in to manage properties and pricing</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login to Admin Panel</CardTitle>
            <CardDescription>Enter your administrator credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@renthub.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong>
                <br />
                Email: admin@renthub.com
                <br />
                Password: admin123
              </p>
              <button type="button" onClick={handleDemoFill} className="mt-3 text-sm font-semibold text-blue-700 underline">
                Fill demo credentials
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            ← Back to Properties
          </Link>
        </div>
      </div>
    </div>
  )
}
