import { Schema, model, Types } from 'mongoose';

export interface ITestRun {
  testCase: Types.ObjectId;
  owner: Types.ObjectId;
  status: 'passed' | 'failed' | 'timedout' | 'error';
  emulation: {
    device?: string;
    browser: string;
  };
  durationMs: number;
  startedAt: Date;
  finishedAt: Date;
  stdout: string;
  stderr: string;
  errorMessage?: string;
  report?: any;
  artifacts: Array<{
    type: 'screenshot' | 'video' | 'trace';
    path: string;
  }>;
}

const TestRunSchema = new Schema<ITestRun>({
  testCase: { type: Schema.Types.ObjectId, ref: 'TestCase', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['passed', 'failed', 'timedout', 'error'], required: true },
  emulation: {
    device: { type: String },
    browser: { type: String, required: true }
  },
  durationMs: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date, required: true },
  stdout: { type: String, default: '' },
  stderr: { type: String, default: '' },
  errorMessage: { type: String },
  report: { type: Schema.Types.Mixed },
  artifacts: [{
    type: { type: String, enum: ['screenshot', 'video', 'trace'], required: true },
    path: { type: String, required: true }
  }]
}, {
  timestamps: true
});

export const TestRun = model<ITestRun>('TestRun', TestRunSchema);
