import UserService from "../service/user.service.js";
import userDao from "../daos/dao.mongo/user.dao.js";


class UserController {
    constructor() {
        this.service = new UserService(userDao);
    }

    async getAll() {
        return await this.service.getAll();
    }

    async getByEmail(email) {
        return await this.service.getByEmail(email);
    }

    async createUser(userData) {
        return await this.service.createUser(userData);
    }
    async getInactiveUsers(){
        return await this.service.getInactiveUsers();
    }

    async getUserById(id) {
        return await this.service.getUserById(id);
    }

    async deleteUserById(id) {
        return await this.service.deleteUserById(id);
    }

}

const userController = new UserController;

export default userController;