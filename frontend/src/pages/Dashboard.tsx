import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await api.get('/questions')
      return res.data
    },
  })

  if (isLoading) return <div>Loading...</div>

  // group by category
  const grouped: Record<string, any[]> = {};
  (data || []).forEach((q: any) => {
    const cat = q.category || 'General'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(q)
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} className="mb-6">
          <h3 className="text-lg font-medium mb-2">{cat}</h3>
          <div className="grid gap-4">
            {items.map((q: any) => (
              <article key={q._id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <Link to={`/questions/${q._id}`} className="text-xl font-semibold text-blue-600">{q.title}</Link>
                <div className="text-sm text-gray-500">{q.difficulty} • {q.tags?.join(', ')}</div>
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <strong>Answer:</strong>
                  <div className="mt-1">
                    {q.answer ? <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded">{q.answer.slice(0, 240) + (q.answer.length > 240 ? '...' : '')}</pre> : 'No answer yet'}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
