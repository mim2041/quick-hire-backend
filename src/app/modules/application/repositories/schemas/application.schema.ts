import { Schema, model, Types } from 'mongoose';

export interface IApplication {
  job: Types.ObjectId;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    resumeLink: {
      type: String,
      required: true,
      trim: true,
    },
    coverNote: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Application = model<IApplication>('Application', applicationSchema);

