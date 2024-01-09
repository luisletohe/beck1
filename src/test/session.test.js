import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest('http://localhost:8080')

describe('Test de intregracion - session', () => {

    let ValueCookie = {};

    // para testeo, remover el middleware del usuario en user.router //

    it('El post /api/users para registrar un usuario', async () => {
        const { statusCode, _body } = await request.post('/api/users/').send({
            first_name: 'Julia',
            last_name: 'Davila',
            email: 'juliaddafffddssssddvila@gmail.com',
            password: '124534',
            img: 'fiomfo',
        })
            .redirects(1);

        expect(statusCode).to.equal(200)

    })


    it('El post /api/users/auth para login de un usuario', async () => {
        const data = await request.post('/api/users/auth').send({
            email: 'juliaddafffddssssddvila@gmail.com',
            password: '124534',
        })

        const cookie = data.headers["set-cookie"][0]

        ValueCookie = {
            name: cookie.split("=")[0],
            value: cookie.split("=")[1],
        };

        expect(ValueCookie.name).to.be.ok.and.equal("token");
        expect(ValueCookie.value).to.be.ok;
        expect(data.redirect).to.equal(true)

    })



    it('elimino la cookie procediendo al logout', async () => {

        const logout = await request.post('/api/users/logout')

        expect(logout.statusCode).to.equal(200)
        expect(logout.ok).to.equal(true)
    })


})