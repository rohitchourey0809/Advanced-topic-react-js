import { Router } from 'express'
import { createQuestion, listQuestions, getQuestion, updateQuestion, deleteQuestion } from '../controllers/question.controller'

const router = Router()

// Public listing and creation endpoints for simpler demo flows
router.get('/', listQuestions)
router.get('/:id', getQuestion)
router.post('/', createQuestion)
router.put('/:id', updateQuestion)
router.delete('/:id', deleteQuestion)

export default router
