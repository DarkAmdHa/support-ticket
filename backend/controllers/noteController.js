const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')
const { default: mongoose } = require('mongoose')
const { request } = require('express')

// @desc    Get ticket notes
//@route    GET /api/tickets/:ticketId/notes
//@access   Private
const getNotes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.ticketId)
  console.log(ticket)
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Ticket not authorized')
  }

  const notes = await Note.find({ ticket: req.params.ticketId })
  res.status(200).json(notes)
})

// @desc    Create a ticket note
//@route    POST /api/tickets/:ticketId/notes
//@access   Private
const addNote = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.ticketId)
  if (ticket.user.toString() != req.user.id) {
    res.status(401)
    throw new Error('Ticket not authorized')
  }

  const note = await Note.create({
    ticket: req.params.ticketId,
    text: req.body.text,
    isStaff: false,
    user: req.user.id,
  })
  res.status(201).json(note)
})

module.exports = {
  getNotes,
  addNote,
}
