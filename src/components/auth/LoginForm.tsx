'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { apiService } from '@/services/api'
import { toast } from 'sonner'
import { Loader2, Mail, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const response = await apiService.auth.login({
        email: data.email,
        password: data.password,
      })

      if (response.success && response.data) {
        const { user, token } = response.data
        login(user, token)
        toast.success(response.message || 'Logged in successfully!')

        // Redirect based on role
        if (user.role === 'op_tier1' || user.role === 'op_tier2' || user.is_admin) {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } catch (error: any) {
      // Error handling is managed by httpClient interceptor
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="pl-10 bg-white/5 border-white/10 focus:border-cyan/50"
            {...form.register('email')}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 bg-white/5 border-white/10 focus:border-cyan/50"
            {...form.register('password')}
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-cyan text-navy font-bold h-11 hover:bg-cyan/90 transition-all cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
        ) : (
          'Login'
        )}
      </Button>

      <div className="text-center text-sm text-foreground/40">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-cyan hover:underline font-medium">Sign up</a>
      </div>
    </form>
  )
}
