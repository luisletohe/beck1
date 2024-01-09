
export default class cartService {

    constructor(dao) {
        this.dao = dao;
    }

    async addCart() {
        return this.dao.addCart({ products: [] })
    }


    async getCartId(cid) {
        return await this.dao.getCartId(cid)
    }

    async addProductCart(cid, pid) {
        return this.dao.addProductCart(cid, pid);
    }


    async deleteProductCart(cid, pid) {
        return this.dao.deleteProductCart(cid, pid)
    }


    async updateCart(cid, newProducts) {

        return this.dao.updateCart(cid, newProducts);

    }

    async updateQuantityProduct(cid, pid, qty) {
        return this.dao.updateQuantityProduct(cid, pid, qty)

    }

    async clearProductToCart(cid) {
        return this.dao.clearProductToCart(cid);
    }


}