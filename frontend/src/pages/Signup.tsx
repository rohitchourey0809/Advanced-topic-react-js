import React, { useState } from 'react'
import api from '../services/api'
import { setAccessToken } from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
  confirm: string
}

export default function Signup() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormValues>()
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      const res = await api.post('/auth/signup', { email: data.email, password: data.password })
      const { accessToken } = res.data
      setAccessToken(accessToken)
      navigate('/')
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Signup failed')
    }
  }

  const password = watch('password')

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-2">Create your account</h2>
        <p className="text-sm text-gray-500 mb-6">Start practicing interview questions and save your progress.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
              type="email"
              placeholder="you@company.com"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-900"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
              type="password"
              placeholder="Choose a secure password"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-900"
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              {...register('confirm', { required: 'Please confirm password', validate: v => v === password || 'Passwords do not match' })}
              type="password"
              placeholder="Confirm password"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-900"
              aria-invalid={errors.confirm ? 'true' : 'false'}
            />
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
          </div>

          {serverError && <div className="text-sm text-red-600">{serverError}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
        </div>
      </div>
    </div>
  )
}
