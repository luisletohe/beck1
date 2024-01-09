import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest('http://localhost:8080')

describe('test de integracion - carts', () => {

  // se debe sacar los middleware en las rutas carts antes del testeo por falta se token de usuario //
    let cart = {};

    it('Metodo post para crear un carrito', async () => {

        const { statusCode, _body } = await request.post('/api/carts')

        cart = _body._id

        expect(statusCode).to.equal(201)
        expect(_body._id).to.be.ok
        expect(_body.products).to.be.ok
    })


    it(' Metodo get para obtener un cart', async () => {

        const { statusCode, _body } = await request.get(`/api/carts/${cart}`)

        expect(statusCode).to.equal(201)
        expect(_body._id).to.be.ok
        expect(_body.products).to.be.ok
    })


    it('Metodo delete para eliminar un cart', async () => {

        const { statusCode, _body } = await request.delete(`/api/carts/${cart}`)

        expect(statusCode).to.equal(200)
        expect(_body.acknowledged).to.equal(true)
        expect(_body.deletedCount).to.equal(1)

    })


})