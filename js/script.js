const productsEl = document.querySelector(".products");
const cartItemsEl = document.getElementById("cartItems");
const cartItemEl = document.querySelector(".cart");
const subtotalEl = document.querySelector(".subtotal");
const totalPriceEl = document.querySelector("#totalPrice");
const clearCartEl = document.getElementById("clear");
// const buttonsEl = document.querySelector(".button")

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
            <input type="text" class="count" value="${product.stock}" />
           <button type="button" class="btn btn-success">Agregar</button>
           <button type="button" class="btn btn-danger">Eliminar</button>
          </div>`;
    productsEl.appendChild(productBox);
  

    let btnAddList = document.createElement("button");
    
    btnAddList.addEventListener("click", () => {
     
      Toastify({
        text: "Added product!",
        duration: 2000,
        gravity: "center",
        position: "right",
        style: {
          background: "linear-gradient(to right, #5bce51 ,  #bcedb8  ",
        },
      }).showToast();
    });

    let btnEliminateList = document.createElement("button");

    btnEliminateList.addEventListener("click", (event) => {
  
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
 
};

// array cart
let cart;

if (localStorage.getItem("cart") === null) {
  cart = [];
} else {
  cart = JSON.parse(localStorage.getItem("cart"));
}

const eliminateFromCart = (product) => {
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  renderProducts(products);
};

// const countRemainingStock = () => {
//   products.forEach((product) => {
//     let remainingStock = product.stock;

//     cart.forEach((item) => {
//       if (item.id === product.id) {
//         remainingStock -= item.numberOfUnits;
//       }
//     });

//     product.remainingStock = remainingStock;
//   });
// };

const updateCart = () => {
  //   countRemainingStock();
  renderTotalPrice();
};

const addToCart = (id) => {
  let products;
  console.log("addToCart called");
  const item = products.find((product) => product.id === id);
  console.log("Item stock:", item.stock);
  if (item.stock <= 0) {
    alert("this product is out of stock.");
  } else {
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated:", cart);
  }
  updateCart();
  //   countRemainingStock();
};

const clearCart = () => {
  cart = [];
  localStorage.removeItem("cart");
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
