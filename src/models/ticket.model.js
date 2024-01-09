import mongoose from "mongoose";

const ticketSheman = new mongoose.Schema({

    code: {
        type: String,
        unique: true,
        required: true, 
        
    },
    purchase_datatime: {
        type: String,
        required: true, 
    },
    purchaser: {
        type: String,
        required: true, 
    },
    amount: {
        type: Number,
        required: true, 
    },
})

const ticketModel = mongoose.model('ticket', ticketSheman);
export default ticketModel