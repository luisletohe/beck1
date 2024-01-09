export default class UsersAdminDTO {
    constructor(usuarios) {
        this.usuarios = usuarios.map((usuario) => {
            return {
                first_name: usuario.first_name,
                email: usuario.email,
                rol: usuario.rol,
                _id: usuario._id
            };
        });
    }
}
