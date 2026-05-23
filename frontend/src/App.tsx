import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import QuestionList from './pages/QuestionList'
import Playground from './pages/Playground'
import Login from './pages/Login'
import Signup from './pages/Signup'
import QuestionDetail from './pages/QuestionDetail'
import CreateQA from './pages/CreateQA'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Advanced Interview Prep</h1>
          <nav className="space-x-4">
            <Link to="/">Dashboard</Link>
            <Link to="/questions">Questions</Link>
            <Link to="/create">Submit Q/A</Link>
            <Link to="/playground">Playground</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/create" element={<CreateQA />} />
          <Route path="/edit/:id" element={<CreateQA />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  )
}
