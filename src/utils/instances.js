import ProductManager from "../service/products.service.js";

import cartManagers from "../service/cart.service.js";
// instancias //
export const productList = new ProductManager();
export const cartList = new cartManagers();