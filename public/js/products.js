
const addToCartButtons = document.querySelectorAll(".addToCart");
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


const cartId = localStorage.getItem('cartId')

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    async function addProductCart() {
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response => {
        if (response.ok) {
          swal("¡La haz agregado a tu carrito! ", ` `, "success")
        } else {
          swal("¡No estas autorizado! ", "¡No puedes comprar tus propios productos! ", "warning");
        }
      })
    }
    addProductCart()
  });
});


const deleteProducttButtons = document.querySelectorAll(".deleteProduct");

deleteProducttButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    async function deleteProductCart() {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          if (response.ok) {
            swal("¡Haz Eliminado tu producto! ", ` ¡Ya no existe en tu tienda! `, "success");
            setTimeout(function () {
              location.reload();
          }, 2000);
          } else {
            swal("¡No estas autorizado! ", " ...¡No puedes eliminar productos que no son tuyos! ", "warning");
          }
        })
    }
    deleteProductCart()
  });
});