
export default class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  async addProducts(product) {
    return this.dao.addProducts(product)
  }

  async getProducts(limit, page, sort, descripcion, availability) {
    const result = await this.dao.getProducts(limit, page, sort, descripcion, availability);
    return result;
  }


  async updateProduct(uid, productActualizado) {
    return this.dao.updateProduct(uid, productActualizado);
  }

  async getProductsById(uid) {
    return this.dao.getProductsById(uid)
  }


  async deleteProduct(pid) {
    return this.dao.deleteProduct(pid);
  }

}