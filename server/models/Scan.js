const mongoose = require('mongoose');

const scanSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  url: {
    type: String,
    required: true,
  },
  issues: [
    {
      type: String,
    }
  ],
  note: {
    type: String,
  },
  pageSpeedInsights: {
    type: Object,
  },
  microlinkData: {
    type: Object,
  },
  whoisData: {
    type: Object,
  },
  ipinfoData: {
    type: Object,
  },
}, {
  timestamps: true,
});

const Scan = mongoose.model('Scan', scanSchema);

module.exports = Scan; 