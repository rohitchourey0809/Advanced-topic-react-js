import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

type FormValues = {
  title: string
  category?: string
  tags?: string
  answer: string
}

export default function CreateQA() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormValues>()
  const [preview, setPreview] = useState(true)
  const [saved, setSaved] = useState(false)
  const watchedAnswer = watch('answer') || ''
  const watchedTitle = watch('title') || ''
  const slug = useMemo(() => watchedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), [watchedTitle])

  useEffect(() => {
    if (!id) return
    let mounted = true
    api.get(`/questions/${id}`).then(res => {
      if (!mounted) return
      const q = res.data
      reset({
        title: q.title || '',
        category: q.category || '',
        tags: (q.tags || []).join(', '),
        answer: q.answer || ''
      })
    }).catch(() => {})
    return () => { mounted = false }
  }, [id])

  const onSubmit = async (data: FormValues) => {
    const payload = {
      title: data.title,
      category: data.category || 'General',
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      answer: data.answer,
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (id) {
      await api.put(`/questions/${id}`, payload)
      navigate(`/questions/${id}`)
    } else {
      await api.post('/questions', payload)
      setSaved(true)
      setTimeout(() => navigate('/'), 700)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">{id ? 'Edit Question & Answer' : 'Submit Question & Answer'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question Title</label>
              <input {...register('title', { required: true })} className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800" placeholder="Short descriptive title" />
            {errors.title && <p className="text-xs text-red-500">Title is required</p>}
            <p className="text-xs text-gray-500 mt-1">Slug: <span className="font-mono">{slug || 'n/a'}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input {...register('category')} className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800" placeholder="e.g., React, JavaScript" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input {...register('tags')} className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800" placeholder="react, hooks" />
            </div>
          </div>

          <div className="md:flex md:space-x-4">
            <div className="md:w-1/2">
              <label className="block text-sm font-medium mb-1">Answer (Markdown supported)</label>
              <textarea {...register('answer', { required: true })} rows={14} className="w-full p-3 border rounded font-mono bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder={`Use markdown. Wrap code blocks with triple backticks.`} />
              {errors.answer && <p className="text-xs text-red-500">Answer is required</p>}
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">Tip: use triple backticks for code blocks</div>
                <div>
                  <label className="mr-2 text-xs">Preview</label>
                  <input type="checkbox" checked={preview} onChange={() => setPreview(v => !v)} />
                </div>
              </div>
            </div>

            <div className="md:w-1/2 mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-1">Preview</label>
              {preview ? (
                <div className="prose max-h-72 overflow-auto p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <ReactMarkdown>{watchedAnswer || '*No content yet*'}</ReactMarkdown>
                </div>
              ) : (
                <pre className="max-h-72 overflow-auto p-3 border rounded font-mono bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">{watchedAnswer || 'No content yet'}</pre>
              )}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">{isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}</button>
            <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border rounded">Cancel</button>
            {saved && <div className="text-sm text-green-600">Saved ✓</div>}
          </div>
        </form>
      </div>
    </div>
  )
}
