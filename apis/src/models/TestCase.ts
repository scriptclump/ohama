import { Schema, model, Types } from 'mongoose';

export interface ITestCase {
  owner: Types.ObjectId;
  name: string;
  description?: string;
  specCode: string;
  targetUrl?: string;
  defaultEmulation?: {
    device?: string;
    browser: 'chromium' | 'firefox' | 'webkit';
  };
  source: 'manual' | 'codegen';
  module?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  specCode: { type: String, required: true },
  targetUrl: { type: String },
  defaultEmulation: {
    device: { type: String },
    browser: { type: String, enum: ['chromium', 'firefox', 'webkit'], default: 'chromium' }
  },
  source: { type: String, enum: ['manual', 'codegen'], default: 'manual' },
  module: { type: String },
  tags: { type: [String], default: [] }
}, {
  timestamps: true
});

export const TestCase = model<ITestCase>('TestCase', TestCaseSchema);
