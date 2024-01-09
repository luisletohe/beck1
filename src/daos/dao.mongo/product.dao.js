
import productModel from "../../models/product.model.js";
import CustomErrors from "../../utils/customError.js";
import ErrorCodes from "../../utils/error.js";
import { generateErrorProduct } from "../../utils/info.js";

class ProductDao {
    constructor() {
        this.product = productModel;
    }

    async addProducts(product) {

        try {
            return await this.product.create(product)
        } catch (err) {
            CustomErrors.createError('Producto ya existe', generateErrorProduct({ err }), 'product existy', ErrorCodes.PRODUCT_ERROR)
        }
    }


    async updateProduct(uid, productActualizado) {
        try {
            return await this.product.updateOne({ _id: uid }, productActualizado);
        } catch (err) {
            CustomErrors.createError('Error update product', generateErrorProduct({ err }), 'Not Update', ErrorCodes.PRODUCT_ERROR)
        }

    }


    async getProducts(limit, page, sort, descripcion, availability) {

        try {
            let options = {};
            let optionalQueries = {};


            if (descripcion) {
                optionalQueries.descripcion = descripcion;
            }


            if (availability !== undefined) {
                optionalQueries.status = availability;
            }


            if (sort === "asc") {
                options.sort = { price: 1 };
            } else if (sort === "desc") {
                options.sort = { price: -1 };
            }




            const products = await this.product.paginate(optionalQueries, {
                page: parseInt(page),
                limit: parseInt(limit),
                ...options,
            });
            return products;
        } catch (err) {
            CustomErrors.createError('Error al obtener los productos', generateErrorProduct({ err }), 'Error al traer los productos del servidor', ErrorCodes.PRODUCT_ERROR)

        }
    }



    async getProductsById(uid) {
        try {
            return await this.product.find({ _id: uid })
        } catch (err) {
            CustomErrors.createError('No se consigue el ID del producto', generateErrorProduct({ err }), 'Product ID', ErrorCodes.PRODUCT_ERROR)
        }

    }


    async deleteProduct(pid) {
        try {
            return await this.product.deleteOne({ _id: pid });
        } catch (err) {
            CustomErrors.createError('No se elimino el producto', generateErrorProduct({ err }), 'Not Delete Product ', ErrorCodes.PRODUCT_ERROR)
        }

    }

}

const productDao = new ProductDao;

export default productDao;