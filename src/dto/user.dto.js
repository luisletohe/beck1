export default class  UserDTO {
    constructor(user){
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.email = user.username,
        this.password = user.password,
        this.documents = user.documents
        this.rol = user.rol,
        this.img = user.img
    }
}

