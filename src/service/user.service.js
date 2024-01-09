


export default class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    getAll() {
        return this.dao.getAll();
    }

    getByEmail(email) {
        return this.dao.getByEmail(email);
    }

    createUser(userData) {
        return this.dao.createUser(userData);
    }

    getInactiveUsers(){
        return this.dao.getInactiveUsers();
    }

    getUserById(id) {
        return this.dao.getUserById(id);
    }

    deleteUserById(id) {
        return this.dao.deleteUserById(id)
    }

}
