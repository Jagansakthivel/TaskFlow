import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [140, 'Task title cannot exceed 140 characters'],
    },
    project: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      default: 'Google Dashboard',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed', 'overdue'],
      default: 'todo',
      index: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    isSeed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to automatically flag overdue tasks if dueDate < now and not completed
taskSchema.pre('save', function (next) {
  if (this.status !== 'completed' && this.dueDate) {
    const referenceDate = this.isSeed ? new Date('2026-01-16T12:00:00.000Z') : new Date();
    referenceDate.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    if (due < referenceDate) {
      this.status = 'overdue';
    }
  }
  next();
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
