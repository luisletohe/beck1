
const cartId = localStorage.getItem('cartId');

async function mostrarCarrito() {
  if (cartId !== null) {




    const response = await fetch(`/api/carts/${cartId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.products.length === 0) {


      const cartHtml = document.getElementById('noproduct');
      cartHtml.innerHTML = '';
      const cartElement = document.createElement('div');
      cartElement.innerHTML = `
              <h1 class=""> NO HAY PRODUCTOS EN EL CARRITO</h1>
          `;
      cartHtml.appendChild(cartElement);
    } else {


      const cartHtml = document.getElementById('mostrarCart');
      cartHtml.innerHTML = '';
      const cartElement = document.createElement('div');
      const total = data.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
      cartElement.innerHTML = `
              <h1>TUS PRODUCTOS</h1>
              <ul>
                  ${data.products.map((product) => `
                      <li>
                          <img class="img-product" src="${product.product.thumbnail}" alt="">
                          <p class="title">${product.product.title}</p>
                          <p>Cantidad: ${product.quantity}</p>
                          <p>Precio: ${product.product.price * product.quantity}</p>   
                          <button class="btn btn-sm btn-success removeProduct" data-product-id="${product.product._id}">Eliminar</button>
                      </li>
                  `).join('')}
              </ul>
              <p class="totalPrice">Total: ${total}</p>
              <button class="btn btn-sm btn-success succesCartClient">Confirmar Compra</button>
          `;
      cartHtml.appendChild(cartElement);

      const removeProductCart = document.querySelectorAll(".removeProduct");

      removeProductCart.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const productId = e.target.dataset.productId;
          const cartId = localStorage.getItem('cartId');

          async function deleteProductCart() {
            try {
              const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              const data = await response.json();

              const cartHtml = document.getElementById('mostrarCart');
              cartHtml.innerHTML = '';
              await mostrarCarrito();
            } catch (error) {
              console.error("Error:", error);
            }
          }

          await deleteProductCart();
        });
      });

      const succesCart = document.querySelectorAll(".succesCartClient");

      succesCart.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          async function purchase() {
            try {
              const response = await fetch(`/api/purchase/${cartId}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const data = await response.json();
              if (data) {
                const ticketHtml = document.getElementById('ticket');
                ticketHtml.innerHTML = '';
                const ticketElement = document.createElement('div');
                ticketElement.innerHTML = `
                <div class="ticketid">
                   <h1>COMPRA REALIZADA</h1>
                  <p class="title">NUMERO DE ORDEN ${data.code}</p>
                  <p>${data.purchase_datatime}</p>
                  <p>Importe de la compra: ${data.amount}</p>   
                  <p>SE TE HA ENVIADO AL EMAIL EL COMPROBANTE DE COMPRA</p>
                  <p>GRACIAS!</p>
                  <a class="nav-link active" aria-current="page" href="/profile">VOLVER</a>
                </div> `;
                ticketHtml.appendChild(ticketElement);
              }

              localStorage.clear();

              const cartHtml = document.getElementById('mostrarCart');
              cartHtml.innerHTML = '';
            } catch (error) {
              console.log("Error:", error);
            }
          }

          await purchase();
        });
      });
    }
  } else {
    const cartHtml = document.getElementById('noproduct');
    cartHtml.innerHTML = '';
    const cartElement = document.createElement('div');
    cartElement.innerHTML = `
          <h1 class=""> NO HAY PRODUCTOS EN EL CARRITO</h1>
      `;
    cartHtml.appendChild(cartElement);
  }
}

mostrarCarrito();


