const Ticket = require('../models/Ticket');
const { classifyTicket } = require('../services/triagemService');

async function createTicket(req, res) {
  try {
    const {
      user_email,
      issue_title,
      issue_description
    } = req.body;

    if (!user_email || !issue_title || !issue_description) {
      return res.status(400).json({
        error: 'user_email, issue_title and issue_description are required'
      });
    }

    const { category, priority } = classifyTicket(
      issue_title,
      issue_description
    );

    const ticket = await Ticket.create({
      user_email,
      issue_title,
      issue_description,
      category,
      priority
    });

    return res.status(201).json(ticket);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}

module.exports = {
  createTicket
};

