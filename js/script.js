const productsEl = document.querySelector(".products");
const cartItemsEl = document.getElementById("cartItems");
const cartItemEl = document.querySelector(".cart");
const subtotalEl = document.querySelector(".subtotal");
const totalPriceEl = document.querySelector("#totalPrice");
const clearCartEl = document.getElementById("clear");
const checkoutButton = document.getElementById("checkoutButton");
const itemInCartEl = document.getElementById("itemInCart");

let products = [];

const url = "./products.json";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    products = data;
    console.log(data);
    renderProducts(data);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });

function renderProducts(products) {
  productsEl.innerHTML = " ";
  products.forEach((product) => {
    let productBox = document.createElement("div");
    productBox.innerHTML = `
          <div class="product medium-4 columns" data-name=${product.name} data-price=${product.price} data-id=${product.id}>
            <img src=${product.imgSrc} alt=${product.name} />
            <h3>${product.name}</h3>
            <p>${product.stock} </p>
           <button type="button" class="btn btn-one">Agregar</button>
           <button type="button" class="btn btn-two">Eliminar</button>
          </div>`;
    productsEl.appendChild(productBox);

    const btnAdd = productBox.querySelector(".btn-one");
    btnAdd.addEventListener("click", () => {
      addToCart(product.id);
      Toastify({
        text: "Added product!",
        duration: 2000,
        gravity: "center",
        position: "right",
        style: {
          background: "linear-gradient(to right, #5bce51 ,  #bcedb8",
        },
      }).showToast();
    });

    const btnEliminate = productBox.querySelector(".btn-two");
    btnEliminate.addEventListener("click", () => {
      // event.stopPropagation();
      const cartItemId = product.id;
      eliminateFromCart(cartItemId);
      Toastify({
        text: "Item eliminated",
        duration: 2000,
        gravity: "center",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ea3e3e, #dd8080",
        },
      }).showToast();
    });
  });
}

// array cart
let cart;

if (localStorage.getItem("cart") === null) {
  cart = [];
} else {
  cart = JSON.parse(localStorage.getItem("cart"));
}

const eliminateFromCart = (cartItemId) => {
  cart = cart.filter((item) => item.id !== cartItemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  updateCartItemsDisplay();
  // renderProducts(products);
};

const countRemainingStock = () => {
  products.forEach((product) => {
    let remainingStock = product.stock;

    cart.forEach((item) => {
      if (item.id === product.id) {
        remainingStock -= item.numberOfUnits;
      }
    });

    product.remainingStock = remainingStock;
  });
};

const updateCart = () => {
  //   countRemainingStock();
  renderTotalPrice();
};

const updateCartItemsDisplay = () => {
  itemInCartEl.innerHTML = "";

  cart.forEach((item) => {
    // const { name, price  } = product;
    const itemInCart = document.createElement("div");
    itemInCart.innerHTML = `<h5> ${item.name} -  $${item.price.toFixed(2)}</h5>  `;
    itemInCartEl.appendChild(itemInCart);
  });
};

const addToCart = (id) => {
  console.log("addToCart called");
  const item = products.find((product) => product.id === id);
  console.log("Item stock:", item.stock);
  if (item.stock <= 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "we do not have anymore stock",
    });
  } else {
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated:", cart);
  }
  item.stock -= 1;
  updateCartItemsDisplay();
  // renderProducts(products);
  renderTotalPrice();
};

const clearCart = () => {
  cart = [];
  localStorage.removeItem("cart");
  itemInCartEl.innerHTML = "";
  renderTotalPrice();
};
clearCartEl.addEventListener("click", clearCart);

const renderTotalPrice = () => {
  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
  });
  console.log("TOTAL Price:", totalPrice);
  totalPriceEl.textContent = `${totalPrice} $`;
};

renderTotalPrice();

const checkOutCart = (productId) => {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.numberOfUnits;
  });
  Swal.fire({
    title: "Checkout",
    text: `Your total is $${total}`,
    icon: "info",
    confirmText: "OK",
  });
};

checkoutButton.addEventListener("click", checkOutCart);
