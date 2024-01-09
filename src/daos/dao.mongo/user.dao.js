import userModel from "../../models/user.model.js"
import moment from "moment";

class UserDao {
    constructor() {
        this.user = userModel
        this.currentTime = moment();
    }


    async getAll() {
        return await this.user.find()
    }


    async getByEmail(email) {
        return await this.user.findOne({ email: email });
    }

    async createUser(userData) {
        return await this.user.create(userData);
    }

    async getInactiveUsers() {

        const twoDaysAgo = moment().subtract(2, 'days').toDate();

        const inactiveUsers = await this.user.find({
            last_connection: {
                $lt: twoDaysAgo,
            }
        });
        return inactiveUsers;
    }

    async getUserById(id) {
        return await this.user.findById(id);
    }

    async deleteUserById(id) {
        return await this.user.findByIdAndDelete(id);
    }
}


const userDao = new UserDao;

export default userDao;