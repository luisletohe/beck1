
import cartModel from '../../models/carts.model.js';
import ErrorCodes from '../../utils/error.js';
import CustomErrors from '../../utils/customError.js';
import { generateErrorCart } from '../../utils/info.js';


class CartDao {

    constructor() {
        this.cart = cartModel;
    }

    async addCart() {
        try {
            const cart = await this.cart.create({ products: [] });
            return cart;
        } catch (err) {
            CustomErrors.createError('Problemas al crear un cart', generateErrorCart({ err }), 'Error create cart', ErrorCodes.CART_ERROR)
        }
    }


    async getCartId(cid) {
        try {
            return await this.cart.findById(cid).populate('products.product').lean();
        } catch (err) {
            CustomErrors.createError('Problemas al conseguir id cart', generateErrorCart({ err }), 'Error cart ID', ErrorCodes.CART_ERROR)
        }

    }

    async addProductCart(cid, pid) {

        try {
            const cart = await this.cart.findOne({ _id: cid });
            const index = cart.products.findIndex((producto) => {
                return producto.product !== null && producto.product.toString() === pid;
            });

            if (index === -1) {
                cart.products.push({ product: pid, quantity: 1 })
            } else {
                cart.products[index].quantity += 1;
            }

            return await cart.save()
        } catch (err) {
            CustomErrors.createError('Problema en agregar pid al cid', generateErrorCart({ err }), 'Error cart add', ErrorCodes.CART_ERROR)
        }

    }


    async deleteProductCart(cid, pid) {
        try {
            const cart = await this.cart.findOne({ _id: cid });

            const productIndex = cart.products.findIndex(product => product.product.equals(pid));

            cart.products[productIndex].quantity -= 1;

            if (cart.products[productIndex].quantity <= 0) {
                cart.products.splice(productIndex, 1);
            } else {
                console.log("Se eliminó uno del quantity del producto:", cart.products[productIndex]);
            }
            return await cart.save();
        } catch (err) {
            CustomErrors.createError('Probl en eliminar pid del cid', generateErrorCart({ err }), 'Error cart,  product delete ', ErrorCodes.CART_ERROR)
        }
    }


    async updateCart(cid, newProducts) {
        try {
            const cart = await this.cart.findOne({ _id: cid });
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }
            console.log(cart.products, newProducts.products)
            cart.products = newProducts.products;
            await cart.save();
            return cart;
        } catch (err) {
            CustomErrors.createError('Problema en agregar pid al cid', generateErrorCart({ err }), 'Error cart add', ErrorCodes.CART_ERROR)
        }

    }


    async updateQuantityProduct(cid, pid, qty) {
        try {
            const cart = await this.cart.findOne({ _id: cid });
            const product = cart.products.find((product) => product._id == pid);
            if (!product) {
                throw new Error('No se encontró el producto en el carrito');
            }
            product.quantity = qty;

            await cart.save();
            return cart;
        } catch (err) {
            CustomErrors.createError('Error en la actualización de la cantidad', generateErrorCart({ err }), 'Error update quantity', ErrorCodes.CART_ERROR)

        }
    }


    async clearProductToCart(cid) {
        try {
            const cart = await this.cart.deleteOne({ _id: cid });
            return cart;
        } catch (err) {
            CustomErrors.createError('Error vaciar carrito', generateErrorCart({ err }), 'Error clean Cart', ErrorCodes.CART_ERROR)
        }
    }


}


const cartDao = new CartDao;
export default cartDao;