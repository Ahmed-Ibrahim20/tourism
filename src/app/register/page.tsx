'use client'

import AuthLayout from '@/components/auth/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'
import { useI18n } from '@/lib/i18n'

export default function RegisterPage() {
  const { t } = useI18n()

  return (
    <AuthLayout 
      title={t('nav.register')} 
      subtitle="Join us today and start planning your dream trip."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
