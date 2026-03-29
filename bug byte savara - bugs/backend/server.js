const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt'); // For password hashing 

const app = express();
app.use(cors());
app.use(express.json());

let USERS = [];
(async () => {
  const hash = await bcrypt.hash("1234", 10);
  USERS.push({ username: "user", password: hash });
})();

const ADMIN = { username: "admin", password: "1234" };

let products = [
  { id: 1, name: "MacBook Pro", price: 150000 },
  { id: 2, name: "iPhone", price: 80000 },
  { id: 3, name: "AirPods", price: 20000 }
];

let orders = [];

/* REGISTER */
app.post("/api/user/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) 
    return res.json({ success: false, message: "Missing details" });

  if (USERS.find(u => u.username === username))
    return res.json({ success: false, message: "Username already taken" });

  const hashed = bcrypt.hash(password, 10);
  USERS.push({ username, password: hashed }); 
  res.json({ success: true });
}); // BUG solved

/* LOGIN */
app.post("/api/user/login", (req, res) => {
  const user = USERS.find(
    u => u.username === req.body.username &&
         u.password === req.body.password
  );
  res.json({ success: user }); // BUG
});

/* ADMIN */
app.post("/api/admin/login", (req, res) => {
  const valid =
    req.body.username === ADMIN.username &&
    req.body.password === ADMIN.password;
  res.json({ success: valid });
}); // BUG solved

/* PRODUCTS */
app.post("/api/products", (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== "number")
    return res.json({ success: false, message: "Invalid product details" });
  products.push({ id: Date.now(), name, price });
  res.json({ success: true });
}); // BUG solved

app.delete("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const before = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length === before)
    return res.json({ success: false, message: "Product not found" });
  res.json({ success: true });
});  // BUG solved

/* ORDERS */
app.post("/api/orders", (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1)
    return res.json({ success: false, message: "Invalid order" });
  const product = products.find(p => p.id === productId);
  if (!product)
    return res.json({ success: false, message: "Product not found" });
  orders.push({ productId, quantity, total: product.price * quantity });
  res.json({ success: true });
}); // BUG solved

app.get("/api/orders", (req, res) => res.json(orders));

app.listen(5000, () => console.log("Server running on 5000"));
