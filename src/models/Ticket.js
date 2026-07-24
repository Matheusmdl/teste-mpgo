const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    issue_title: {
      type: String,
      required: true,
      trim: true
    },

    issue_description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      enum: ['baixa', 'media', 'alta', 'critica'],
      required: true
    },

    status: {
      type: String,
      default: 'aberto'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);