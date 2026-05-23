import React, { useState } from 'react'
import api from '../services/api'
import { setAccessToken } from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>()
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      const res = await api.post('/auth/login', { email: data.email, password: data.password })
      const { accessToken } = res.data
      setAccessToken(accessToken)
      navigate('/')
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-6">Log in to continue practicing interviews and tracking progress.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="you@company.com"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-900"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              placeholder="Your password"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-900"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {serverError && <div className="text-sm text-red-600">{serverError}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600">Create one</Link>
        </div>
      </div>
    </div>
  )
}
