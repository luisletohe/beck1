import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest('http://localhost:8080')

describe('Test de intregracion - productos', () => {

    let createdProductId;


    it('El get /api/products para obtener todos los productos', async () => {

        const { statusCode, _body } = await request.get('/api/products')

        expect(_body.payload)
        expect(statusCode).to.equal(201)

    })

    it('El post /api/products para agregar un producto, si es un array lo que devuelve y si hay presente aunque sea uno en la respuesta', async () => {
        const product = [
            {
                title: 'Remera de prueba',
                descripcion: 'remera prueba vip',
                thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDWTxwdqVtby0jFbEmLF6RPRsSEMNFsVx5DA&usqp=CAU',
                price: 25000,
                owner: 'ADMIN',
                code: 'PRUEBA1',
                stock: 25,
            }
        ];

        const response = await request.post('/api/products/').send(product);

        createdProductId = response.body[0]._id;

        expect(response.body);
        expect(Array.isArray(response.body)).to.be.true;
        expect(response.body.length).to.be.greaterThan(0);
        expect(response.statusCode).to.equal(200);
    });




    it('El get /api/products/uid, verifico si trae un producto por id', async () => {

        if (!createdProductId) {
            throw new Error('No se pudo obtener el ID del producto creado anteriormente');
        }

        const data = await request.get(`/api/products/${createdProductId}`)

        expect(data.body[0].owner).to.equal('ADMIN')
        expect(data.statusCode).to.equal(201)
    })


    it('El delete /api/products/uid, elimino el producto acabado de crear para el test ', async () => {

        if (!createdProductId) {
            throw new Error('No se pudo obtener el ID del traido anteriormente');
        }

        const data = await request.delete(`/api/products/${createdProductId}`);

        expect(data.body.acknowledged).to.equal(true)
        expect(data.statusCode).to.equal(201);
    })


}) 