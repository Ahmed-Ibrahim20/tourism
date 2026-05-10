'use client'

import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import { useI18n } from '@/lib/i18n'

export default function LoginPage() {
  const { t } = useI18n()

  return (
    <AuthLayout 
      title={t('nav.login')} 
      subtitle="Welcome back! Please enter your details."
    >
      <LoginForm />
    </AuthLayout>
  )
}
