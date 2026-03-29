const API = "http://localhost:5000";

/* LOGIN */
async function userLogin() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  const res = await fetch(API + "/api/user/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.success === true) {
    window.location.href = "home.html";
  } else {
    alert("Login failed");
  }
}


/* REGISTER */
async function register() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  const res = await fetch(API + "/api/user/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.success === true) {
    window.location.href = "login.html";
  } else {
    alert("Registration failed");
  }
}


/* PRODUCTS */
async function loadProducts() {
  const res = await fetch(API + "/api/product"); 
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      `;

    const btn = document.createElement("button");
    btn.textContent = "Cart";
    btn.onclick = () => addToCart(p.id, p.name, p.price);
    div.appendChild(btn);

    list.appendChild(div); 
  });
}


/* CART */
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  cart.push({ id, name, price });
  localStorage.setItem("cartItems", JSON.stringify(cart));
}


/* ORDER */
async function placeOrder() {
  const name = document.getElementById("name");
  const card = document.getElementById("card");

  if (!card.value || card.value.replace(/\s/g, "").length < 13) {
    alert("Please enter a valid card number.");
    return;
  }

  const item = JSON.parse(localStorage.getItem("buyNowItem"));
  const items = item ? [item] : JSON.parse(localStorage.getItem("cartItems")) || [];

  if (items.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  await fetch(API + "/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      name: name.value,
      card: card.value
    })
  });

  alert("Order placed!");
}

/* ADMIN */
function checkAdmin() {
  if (!localStorage.getItem("admin")) return;
}

async function adminLogin() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  const res = await fetch(API + "/api/admin/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("admin", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Admin login failed");
  } 
}
