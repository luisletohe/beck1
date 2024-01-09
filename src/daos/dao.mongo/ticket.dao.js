
import ticketModel from "../../models/ticket.model.js";
import { generateErrorTicket } from "../../utils/info.js";
import ErrorCodes from "../../utils/error.js";
import CustomErrors from "../../utils/customError.js";

class TicketDao {
    constructor() {
        this.ticket = ticketModel;
    }


    async createTicket(ticket) {
        try {
            const createTicket = this.ticket.create(ticket)
            return createTicket;
        } catch (err) {
            CustomErrors.createError('No se pudo crear el ticket', generateErrorTicket({ err }), 'Error Create Ticket', ErrorCodes.TICKET_ERROR)
        }
    }

    async getTicket() {
        try {
            const getticket = this.ticket.find({})
            return getticket;
        } catch (err) {
            CustomErrors.createError('Error a traer los ticket', generateErrorTicket({ err }), 'Error Get Tickets', ErrorCodes.TICKET_ERROR)

        }
    }

    async getTicketId(id) {
        try {
            const ticketid = this.ticket.findById(id)
            return ticketid;
        } catch (err) {
            CustomErrors.createError('No se pudo obtener el ticket', generateErrorTicket({ err }), 'Error Get Ticket ID', ErrorCodes.TICKET_ERROR)
        }

    }

    async deleteTicket(id) {
        try {
            const deleteTicket = this.ticket.deleteOne(id)
            return deleteTicket;
        } catch (err) {
            CustomErrors.createError('No se pudo eliminar el ticket', generateErrorTicket({ err }), 'Error Delete Ticket ID', ErrorCodes.TICKET_ERROR)
        }

    }

}

const ticketDao = new TicketDao;
export default ticketDao