import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reporter: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'],
    trim: true,
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  status: { type: String, default: 'Open', enum: ['Open', 'Under Review', 'Resolved'] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Issue', issueSchema);