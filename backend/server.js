require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const path = require('path');

const nodemailer = require('nodemailer');

// Removed Mercado Pago client
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

// Old endpoints removed

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

app.post('/api/checkout', async (req, res) => {
    const { userId, total, items, formData } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'howisitmanufactured@gmail.com',
            pass: 'rpiqgwvmvdramnwc'
        }
    });

    let itemsHtml = '<ul>';
    items.forEach(item => {
        const variation = item.variation ? ` - ${item.variation}` : '';
        itemsHtml += `<li>${item.quantity}x ${item.product.name}${variation} (R$ ${item.product.price})</li>`;
    });
    itemsHtml += '</ul>';

    const adminMailOptions = {
        from: 'henriquelimagusmao@gmail.com',
        to: 'henriquelimagusmao@gmail.com',
        subject: 'Novo Pedido Realizado - Gusli Books',
        html: `
            <h2>Novo Pedido Recebido</h2>
            <h3>Dados do Cliente:</h3>
            <p><strong>Nome:</strong> ${formData?.fullName || ''}</p>
            <p><strong>E-mail:</strong> ${formData?.email || ''}</p>
            <p><strong>CPF:</strong> ${formData?.cpf || ''}</p>
            <p><strong>Celular:</strong> ${formData?.phone || ''}</p>
            <p><strong>CEP:</strong> ${formData?.zipCode || ''}</p>
            <p><strong>Endereço:</strong> ${formData?.street || ''}</p>
            <p><strong>Número:</strong> ${formData?.number || ''}</p>
            <p><strong>Complemento:</strong> ${formData?.complement || ''}</p>
            <p><strong>Bairro:</strong> ${formData?.neighborhood || ''}</p>
            <p><strong>Localidade:</strong> ${formData?.city || ''}</p>
            <p><strong>Estado:</strong> ${formData?.state || ''}</p>
            <br/>
            <h3>Itens do Pedido (Total: R$ ${total || 0}):</h3>
            ${itemsHtml}
        `
    };

    const clientMailOptions = {
        from: 'henriquelimagusmao@gmail.com',
        to: formData?.email,
        subject: 'Confirmação de Pedido - Gusli Books',
        text: 'Seu pedido foi feito. Entraremos em contato para realizar o pagamento em breve. Obrigado por pedir na Gusli Books.'
    };

    try {
        await transporter.sendMail(adminMailOptions);
        if (formData?.email) {
            await transporter.sendMail(clientMailOptions);
        }

        // Save order if logged in
        if (userId && total) {
            const orderCode = `GUSLI-${Date.now()}`; // simplified distinct code
            db.run("INSERT INTO Orders (user_id, total, status, items, order_code) VALUES (?, ?, ?, ?, ?)",
                [userId, total, 'Aguardando Pagamento', JSON.stringify(items), orderCode], function (insertErr) {
                    if (insertErr) console.error("Error saving order:", insertErr);
                });
        }

        db.run("DELETE FROM Cart", function (err) {
            if (err) console.error("Error clearing cart backend:", err);
            res.json({ message: "Checkout successful, emails sent, cart cleared.", status: "success" });
        });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ error: "Failed to process checkout emails" });
    }
});

app.delete('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ error: "User ID missing" });

    db.run("DELETE FROM Users WHERE id = ?", [userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "User not found" });
        res.json({ message: "Account deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
