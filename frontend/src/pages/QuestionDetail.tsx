import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export default function QuestionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      const res = await api.get(`/questions/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading question.</div>

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-blue-600">&larr; Back</Link>
        <div className="flex gap-2">
          <Link to={`/edit/${data._id}`} className="text-sm px-2 py-1 border rounded">Edit</Link>
          <button onClick={async () => {
            if (!confirm('Delete this question?')) return
            await api.delete(`/questions/${data._id}`)
            navigate('/')
          }} className="text-sm px-2 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mt-4">{data.title}</h1>
      <div className="text-sm text-gray-500 mb-4">Difficulty: {data.difficulty} • Tags: {data.tags?.join(', ')}</div>
      <section className="prose dark:prose-invert">
        <h2>Problem</h2>
        <div dangerouslySetInnerHTML={{ __html: data.description || '' }} />
        <h2>Explanation</h2>
        <div dangerouslySetInnerHTML={{ __html: data.explanation || '' }} />
      </section>
    </div>
  )
}
