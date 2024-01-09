import { faker } from "@faker-js/faker";

export function generateProducts(page = 1, limit = 4, sort = "", descripcion = "", availability = true) {
    const totalProducts = 20;
    const totalPages = Math.ceil(totalProducts / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalProducts);

    const docs = [];

    for (let i = 0; i < totalProducts; i++) {
        docs.push({
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            descripcion: faker.commerce.productDescription(),
            thumbnail: faker.image.url(),
            price: faker.number.float({ min: 10, max: 100, precision: 0.001 }),
            code: faker.finance.accountNumber(5),
            stock: faker.finance.accountNumber(2),
            __v: 0
        });
    }

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    const prevLink = prevPage &&
        `/index/?page=${prevPage}&limit=${4}&sort=${sort}&descripcion=${encodeURIComponent(descripcion)}${availability ? `&availability=${availability}` : ""}`;

    const nextLink = nextPage &&
        `/index/?page=${nextPage}&limit=${4}&sort=${sort}&descripcion=${encodeURIComponent(descripcion)}${availability ? `&availability=${availability}` : ""}`;

    return {
        docs,
        totalDocs: totalProducts,
        limit,
        totalPages,
        page,
        pagingCounter: page,
        hasPrevPage: prevPage !== null,
        hasNextPage: nextPage !== null,
        prevLink,
        nextLink,
    };
}
