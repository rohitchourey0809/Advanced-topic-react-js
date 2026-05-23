import { Schema, model } from 'mongoose'

const questionSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  explanation: { type: String },
  answer: { type: String },
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Medium' },
  tags: [String],
  companies: [String],
  approaches: [String],
  codeExamples: [Object],
  category: String,
  relatedQuestions: [String],
  bookmarksCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export default model('Question', questionSchema)
