import { Schema, model, Types } from 'mongoose';

export interface IAudit {
  actor?: Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: Types.ObjectId | string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const auditSchema = new Schema<IAudit>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    resource: {
      type: String,
      required: true,
      trim: true,
    },
    resourceId: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const Audit = model<IAudit>('Audit', auditSchema);

