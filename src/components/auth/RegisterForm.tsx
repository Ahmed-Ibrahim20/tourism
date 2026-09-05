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
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    try {
      const response = await apiService.auth.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      })
      
      if (response.success && response.data) {
        const { user, token } = response.data
        login(user, token)
        toast.success(response.message || 'Account created successfully!')
        router.push('/')
      }
    } catch (error: any) {
      // Error is handled by httpClient interceptor
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
          <Input
            id="name"
            placeholder="John Doe"
            className="pl-10 bg-white/5 border-white/10 focus:border-cyan/50"
            {...form.register('name')}
          />
        </div>
        {form.formState.errors.name && (
          <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>

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
        <Label htmlFor="password">Password</Label>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="pl-10 bg-white/5 border-white/10 focus:border-cyan/50"
            {...form.register('confirmPassword')}
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-xs text-destructive mt-1">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-cyan text-navy font-bold h-11 hover:bg-cyan/90 transition-all mt-2 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>
        ) : (
          'Create Account'
        )}
      </Button>

      <div className="text-center text-sm text-foreground/40 mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-cyan hover:underline font-medium">Login</a>
      </div>
    </form>
  )
}
