import { Schema, model } from 'mongoose'

const refreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true })

export default model('RefreshToken', refreshTokenSchema)
