import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getTicket, closeTicket } from '../features/tickets/ticketSlice'
import {
  getNotes,
  reset as notesReset,
  createNote,
} from '../features/notes/noteSlice'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { FaPlus } from 'react-icons/fa'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import BackButton from '../components/BackButton'

const customStyles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    mariginRight: '-50%',
    transform: 'translate(-50%,-50%)',
    position: 'relative',
  },
}

Modal.setAppElement('#root')

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const { isLoading, isError, isSuccess, message, ticket } = useSelector(
    (state) => state.tickets
  )

  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  )

  const { ticketId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
  }, [isError, message, getTicket, ticketId])

  //Close Ticket
  const onTicketClose = (e) => {
    dispatch(closeTicket(ticketId))
    toast.success('Ticket Closed')
    navigate('/tickets')
  }

  const openModal = (e) => setModalIsOpen(true)
  const closeModal = (e) => setModalIsOpen(false)

  const onNoteSubmit = (e) => {
    e.preventDefault()
    dispatch(createNote({ noteText, ticketId }))
    closeModal()
  }

  if (isLoading || notesIsLoading) {
    return <Spinner />
  }

  if (isError) {
    return <h3>Something Went Wrong</h3>
  }
  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: ${new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <h3>Product: ${ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        {notes.length > 0 && <h2>Notes</h2>}
      </header>

      {ticket.status !== 'closed' && (
        <>
          <button onClick={openModal} className="btn">
            <FaPlus />
            Add Note
          </button>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Add Note"
          >
            <h2>Add Note</h2>
            <button className="btn-close" onClick={closeModal}>
              X
            </button>

            <form onSubmit={onNoteSubmit}>
              <div className="form-group">
                <textarea
                  name="noteText"
                  id="noteText"
                  className="form-control"
                  placeholder="Note Text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group">
                <button className="btn" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </Modal>
        </>
      )}
      {notes.map((note) => {
        return <NoteItem key={note._id} note={note} />
      })}
      {ticket.status != 'closed' && (
        <button className="btn btn-block btn-danger" onClick={onTicketClose}>
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket
