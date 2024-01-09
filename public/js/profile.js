
const existingCartId = localStorage.getItem('cartId');

async function verifyCart() {
    if (existingCartId !== null) {
    } else {
        try {
            const response = await fetch(`/api/carts/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            localStorage.setItem('cartId', data._id);

        } catch (error) {
            console.error("Error:", error);
        }
    }
}

verifyCart();

