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
      // Mock login delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      login({
        id: '1',
        name: data.email.split('@')[0],
        email: data.email,
      })
      
      toast.success('Login successful!')
      router.push('/')
    } catch (error) {
      toast.error('Invalid credentials')
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs text-cyan hover:underline">Forgot password?</a>
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
        className="w-full bg-cyan text-navy font-bold h-11 hover:bg-cyan/90 transition-all"
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
