require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const path = require('path');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN, options: { timeout: 5000 } });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve visual assets
app.use('/visual', express.static(path.join(__dirname, '../visual')));

app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM Products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/cart', (req, res) => {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
        return res.status(400).json({ error: "Missing product_id or quantity" });
    }

    if (quantity < 1 || quantity > 10) {
        return res.status(400).json({ error: "Quantity must be between 1 and 10" });
    }

    // Check if item exists in cart
    db.get("SELECT * FROM Cart WHERE product_id = ?", [product_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            // Update existing
            const newQuantity = row.quantity + quantity;
            if (newQuantity > 10) {
                return res.status(400).json({ error: "Total quantity cannot exceed 10" });
            }
            db.run("UPDATE Cart SET quantity = ? WHERE product_id = ?", [newQuantity, product_id], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Cart updated", product_id, quantity: newQuantity });
            });
        } else {
            // Insert new
            db.run("INSERT INTO Cart (product_id, quantity) VALUES (?, ?)", [product_id, quantity], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: "Item added to cart", id: this.lastID });
            });
        }
    });
});

app.put('/api/cart', (req, res) => {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
        return res.status(400).json({ error: "Missing product_id or quantity" });
    }

    if (quantity < 1 || quantity > 10) {
        return res.status(400).json({ error: "Quantity must be between 1 and 10" });
    }

    db.run("UPDATE Cart SET quantity = ? WHERE product_id = ?", [quantity, product_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: "Product not in cart" });
        }
        res.json({ message: "Cart quantity updated", product_id, quantity });
    });
});

app.delete('/api/cart/:id', (req, res) => {
    const product_id = req.params.id;

    db.run("DELETE FROM Cart WHERE product_id = ?", [product_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        res.json({ message: "Item removed from cart" });
    });
});

app.post('/api/checkout', (req, res) => {
    // Read cart elements
    db.all("SELECT * FROM Cart", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        db.run("DELETE FROM Cart", function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Checkout successful, cart cleared.", status: "success" });
        });
    });
});

app.post('/api/create_preference', async (req, res) => {
    try {
        const { cartItems, payerInfo } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const items = cartItems.map(item => ({
            id: String(item.product.id),
            title: item.variation ? `${item.product.name} - ${item.variation}` : item.product.name,
            quantity: Number(item.quantity),
            unit_price: Number(item.product.price),
            currency_id: 'BRL',
        }));

        let payer;
        if (payerInfo) {
            try {
                payer = {
                    name: payerInfo.fullName.split(' ')[0],
                    surname: payerInfo.fullName.split(' ').slice(1).join(' '),
                    email: payerInfo.email
                };
            } catch (e) {
                console.log("Error parsing payer info, proceeding without it.");
            }
        }

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items,
                payer: payer,
                back_urls: {
                    success: "https://localhost:5173",
                    failure: "https://localhost:5173",
                    pending: "https://localhost:5173",
                },
                auto_return: "approved",
            }
        });

        res.json({ id: response.id, init_point: response.init_point });

    } catch (error) {
        console.error("Error creating preference:", error);
        res.status(500).json({ error: "Failed to create preference" });
    }
});

// SIMULATED AUTH & ACCOUNT ENDPOINTS
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.run("INSERT INTO Users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function (err) {
        if (err) {
            // Check for UNIQUE constraint failure
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "E-mail já cadastrado" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name: name, email: email });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.get("SELECT id, name, email, created_at FROM Users WHERE email = ? AND password = ?", [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        res.json(user);
    });
});

app.get('/api/user/orders', (req, res) => {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ error: "User ID missing" });

    db.all("SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Update checkout to save an Order if a user is logged in
app.post('/api/checkout', (req, res) => {
    const { userId, total, items } = req.body;

    db.run("DELETE FROM Cart", function (err) {
        if (err) return res.status(500).json({ error: err.message });

        if (userId && total) {
            db.run("INSERT INTO Orders (user_id, total, status, items) VALUES (?, ?, ?, ?)",
                [userId, total, 'Pago via Pix', JSON.stringify(items || [])], function (insertErr) {
                    if (insertErr) console.error("Error saving order:", insertErr);
                    res.json({ message: "Checkout successful, order saved, cart cleared.", status: "success" });
                });
        } else {
            res.json({ message: "Checkout successful, cart cleared.", status: "success" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
