import { Schema, model } from 'mongoose';

export interface ICompany {
  name: string;
  description?: string;
  website?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Company = model<ICompany>('Company', companySchema);

