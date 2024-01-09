
export default class TickeService {
    constructor(dao) {
        this.dao = dao;
    }


    async createTicket(ticket) {
        const createTicket = this.dao.createTicket(ticket)
        return createTicket
    }

    async getTicket() {
        const getticket = this.dao.getTicket()
        return getticket;
    }

    async getTicketId(id) {
        const ticketid = this.dao.getTicketId(id)
        return ticketid;
    }

    async deleteTicket(id) {
        const deleteTicket = this.dao.deleteTicket(id)
        return deleteTicket;
    }

}