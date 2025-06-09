import type { Document } from 'payload/types'

export interface Stone extends Document {
  stoneType: string
  minum: string
  createdBy: {
    id: string
    role: string
  }
}
