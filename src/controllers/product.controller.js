import ProductService from "../service/products.service.js";
import productDao from "../daos/dao.mongo/product.dao.js";


class ProductController {
    constructor() {
        this.service = new ProductService(productDao);
    }

    addProducts(product) {
        return this.service.addProducts(product)
    }

   async getProducts(limit, page, sort, descripcion, availability) {
        const resulta = await this.service.getProducts(limit, page, sort, descripcion, availability)
        return resulta;
    }


    updateProduct(uid, productActualizado) {
        return this.service.updateProduct(uid, productActualizado);
    }

    getProductsById(uid) {
        return this.service.getProductsById(uid)
    }


    deleteProduct(pid) {
        return this.service.deleteProduct(pid);
    }

}



const productController = new ProductController;
export default productController;