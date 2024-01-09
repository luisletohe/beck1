import ticketDao from "../daos/dao.mongo/ticket.dao.js";
import TickeService from "../service/ticket.service.js";


class TicketController {
    constructor() {
        this.service = new TickeService(ticketDao);
    }

    async createTicket(ticket) {
        const createTicket = await this.service.createTicket(ticket)
        return createTicket;
    }

    async getTicket() {
        const getticket = await this.service.getTicket()
        return getticket;
    }

    async getTicketId(id) {
        const ticketid = await this.service.getTicketId(id)
        return ticketid;
    }

    async deleteTicket(id) {
        const deleteTicket = await this.service.deleteTicket(id)
        return deleteTicket;
    }

}

const ticketController = new TicketController;
export default ticketController;