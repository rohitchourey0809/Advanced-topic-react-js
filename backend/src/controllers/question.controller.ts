import { Request, Response } from 'express'
import Question from '../models/question.model'

export async function createQuestion(req: Request, res: Response) {
  const data = req.body
  // attach creator if available
  if (req.user && (req.user as any).id) data.createdBy = (req.user as any).id
  const q = await Question.create(data)
  res.json(q)
}

export async function listQuestions(req: Request, res: Response) {
  const qs = await Question.find().limit(50)
  res.json(qs)
}

export async function getQuestion(req: Request, res: Response) {
  const id = req.params.id
  let q
  try {
    q = await Question.findById(id)
  } catch (e) {
    // try by slug
    q = await Question.findOne({ slug: id })
  }
  if (!q) return res.status(404).json({ message: 'Question not found' })
  res.json(q)
}

export async function updateQuestion(req: Request, res: Response) {
  const id = req.params.id
  const data = req.body
  try {
    const q = await Question.findByIdAndUpdate(id, { $set: data }, { new: true })
    if (!q) return res.status(404).json({ message: 'Question not found' })
    res.json(q)
  } catch (e) {
    return res.status(400).json({ message: 'Invalid id' })
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  const id = req.params.id
  try {
    const q = await Question.findByIdAndDelete(id)
    if (!q) return res.status(404).json({ message: 'Question not found' })
    res.json({ ok: true })
  } catch (e) {
    return res.status(400).json({ message: 'Invalid id' })
  }
}
