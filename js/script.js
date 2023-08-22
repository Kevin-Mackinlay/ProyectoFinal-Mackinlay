const productsEl = document.querySelector(".products");
const cartItemsEl = document.getElementById("cartItems");
const cartItemEl = document.querySelector(".cart");
const subtotalEl = document.querySelector(".subtotal");
const totalPriceEl = document.querySelector("#totalPrice");
const clearCartEl = document.getElementById("clear");


const url = "../products.json";

fetch(url)
.then(res => res.json())
.then(data => renderProducts(data))


function renderProducts(products){
  products.forEach((product) => {
    let productBox = document.createElement("div");
    productBox.innerHTML = `
          <div class="product medium-4 columns" data-name=${product.name} data-price=${product.price} data-id=${product.id}>
            <img src=${product.imgSrc} alt=${product.name} />
            <h3>${product.name}</h3>
            <input type="text" class="count" value="${product.stock}" />
            <button class="tiny" ${product.stock <= 0 ? "disabled" : ""}>Add to cart</button>
            <button class="tiny eliminate">Eliminate</button>
          </div>`;
    productsEl.appendChild(productBox);
  });


    let btnAdd = productBox.querySelector(".tiny");
    btnAdd.forEach((btn) => {
      btnAdd.onclick = () => addToCart(product.id);
      btnAdd.addEventListener("click", () => {
        if (product.stock <= 0) {
          alert("This product is out of stock.");
          return;
        }
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
    });

    let btnEliminate = productBox.querySelector(".eliminate");
    btnEliminate.forEach((btn) => {
      btnEliminate.addEventListener("click", () => {
        eliminateFromCart(product.id);
        Toastify({
          text: "Item eliminated",
          duration: 2000,
          gravity: "center",
          position: "right",
          style: {
            background: "linear-gradient(to right, #ea3e3e  ,  #dd8080  ",
          },
        }).showToast();
      });
    });
}

renderProducts();





// setInterval(() => {
//   Swal.fire("take advantage of 10% discount");
// }, 2000);

// array cart
let cart;

if (localStorage.getItem("cart") === null) {
  cart = [];
} else {
  cart = JSON.parse(localStorage.getItem("cart"));
}

const eliminateFromCart = (id) => {
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  renderProducts();
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
