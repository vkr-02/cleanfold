const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();



const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }
    const productCollection = client.db("cleanFold").collection("products");
    const orderCollection = client.db("cleanFold").collection("orders");
    const usersCollection = client.db("cleanFold").collection("users");
    const feedbacksCollection = client.db("cleanFold").collection("feedbacks");
    console.log("Connected to local MongoDB at localhost:27017");

    // --- Feedback Endpoints ---
    app.post('/addFeedback', (req, res) => {
        const feedback = req.body;
        feedbacksCollection.insertOne(feedback)
            .then(result => {
                res.send({ success: true, result });
            })
            .catch(err => {
                res.status(500).send({ error: "Failed to submit feedback." });
            });
    });

    app.get('/allFeedbacks', (req, res) => {
        feedbacksCollection.find({})
            .toArray((err, documents) => {
                if (err) {
                    res.status(500).send({ error: "Failed to fetch feedbacks." });
                } else {
                    res.send(documents);
                }
            });
    });

    // --- Authentication Endpoints ---

    // Sign Up
    app.post('/signUp', (req, res) => {
        const { email, password, name } = req.body;

        // Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
        }

        // Check if user already exists
        usersCollection.findOne({ email: email })
            .then(existingUser => {
                if (existingUser) {
                    res.status(400).send({ error: "User already exists with this email." });
                } else {
                    return usersCollection.insertOne({ email, password, name });
                }
            })
            .then(result => {
                if (result) {
                    res.send({ success: true, user: { email, name } });
                }
            })
            .catch(err => {
                res.status(500).send({ error: "Registration failed." });
            });
    });

    // Sign In
    app.post('/signIn', (req, res) => {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        usersCollection.findOne({ email: email, password: password })
            .then(user => {
                if (user) {
                    console.log(`Login successful for: ${email}`);
                    res.send({ success: true, user: { email: user.email, name: user.name } });
                } else {
                    console.log(`Login failed for: ${email} - Invalid credentials`);
                    res.status(401).send({ error: "Invalid email or password." });
                }
            })
            .catch(err => {
                console.error("Login error:", err);
                res.status(500).send({ error: "Login failed." });
            });
    });

    // --- Product and Order Endpoints ---
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // Get all orders
    app.get('/allOrders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // Get orders by email
    app.get('/orders', (req, res) => {
        const email = req.query.email;
        orderCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // Add orders
    app.post('/addOrders', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });

    // Add products
    app.post('/addProducts', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });

    // Delete product
    app.delete('/deleteProducts/:id', (req, res) => {
        const id = req.params.id;
        productCollection.deleteOne({ _id: ObjectId(id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            });
    });

    // Update product
    app.patch('/updateProduct', (req, res) => {
        const updatedProduct = req.body;
        const id = updatedProduct._id;
        delete updatedProduct._id; // Remove _id from update payload

        productCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedProduct })
            .then(result => {
                res.send(result.modifiedCount > 0);
            });
    });

    // Update order status/details
    app.post('/updateOrder', (req, res) => {
        const data = req.body;
        const id = data._id || data.id;
        console.log(`Received update request for order: ${id}`, data);

        const updatedData = { ...data };
        delete updatedData._id;
        delete updatedData.id;

        orderCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedData })
            .then(result => {
                console.log(`Update result for ${id}:`, result.modifiedCount);
                res.send(result.modifiedCount > 0);
            })
            .catch(err => {
                console.error(`Update error for ${id}:`, err);
                res.status(500).send({ error: "Update failed" });
            });
    });

    // Alias for updateOrderDetails
    app.post('/updateOrderDetails', (req, res) => {
        const data = req.body;
        const id = data._id || data.id;
        const updatedData = { ...data };
        delete updatedData._id;
        delete updatedData.id;

        orderCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedData })
            .then(result => res.send(result.modifiedCount > 0))
            .catch(err => res.status(500).send({ error: "Update failed" }));
    });

    // Initialize and Sync data
    console.log("Checking products collection...");
    const initialProducts = require('./products.json');

    // Create default admin user if it doesn't exist
    const defaultAdmin = {
        email: "clean.fold@gmail.com",
        password: "Smart@123",
        name: "Super Admin"
    };

    usersCollection.findOne({ email: defaultAdmin.email })
        .then(admin => {
            if (!admin) {
                console.log("Seeding default admin user...");
                return usersCollection.insertOne(defaultAdmin)
                    .then(() => console.log("Default admin user created successfully."));
            } else {
                console.log("Default admin user already exists.");
            }
        })
        .catch(err => console.error("Error seeding admin:", err));

    //coment this out after first run
    // productCollection.deleteMany({}) // Clean start for synchronization
    //     .then(() => {
    //         console.log("Cleaned products collection. Re-syncing from products.json...");
    //         return productCollection.insertMany(initialProducts);
    //     })
    //     .then(result => {
    //         console.log(`Successfully synced ${result.insertedCount} products to MongoDB.`);
    //     })
    //     .catch(err => {
    //         console.error("Error syncing products:", err);

    //     });
    //till here ..



    app.get('/dashboardStats', async (req, res) => {
        try {
            const allOrders = await orderCollection.find({}).toArray();

            // --- 1. Business Report (Pie Chart) ---
            let stats = {
                'Order Placed': 0,
                'Order Picked': 0,
                'Order Processing': 0,
                'Order Delivered': 0,
                'Order Completed': 0,
                'Revenue': 0
            };

            allOrders.forEach(order => {
                const status = order.status || 'Order Placed'; // Default to placed if missing
                if (stats.hasOwnProperty(status)) {
                    stats[status]++;
                }

                if (status === 'Order Completed' && order.price && order.price.grandTotal) {
                    stats['Revenue'] += parseFloat(order.price.grandTotal) || 0;
                }
            });

            // Calculate Margin (assuming 20%)
            const margin = stats['Revenue'] * 0.20;

            const pieData = [
                { name: 'Margin', uv: parseFloat(margin.toFixed(2)), fill: '#8884d8' },
                { name: 'Placed', uv: stats['Order Placed'], fill: '#83a6ed' },
                { name: 'Picked', uv: stats['Order Picked'], fill: '#8dd1e1' },
                { name: 'Progress', uv: stats['Order Processing'], fill: '#82ca9d' },
                { name: 'Delivered', uv: stats['Order Delivered'], fill: '#a4de6c' },
                { name: 'Completed', uv: stats['Order Completed'], fill: '#d0ed57' },
                { name: 'Revenue', uv: parseFloat(stats['Revenue'].toFixed(2)), fill: '#ffc658' }
            ];

            // --- 2. Weekly Orders (Line Chart) ---
            // Get last 7 days names (e.g., "Monday", "Tuesday")
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            const weeklyDataMap = new Map();

            // Initialize last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dayName = days[d.getDay()];
                const dateKey = d.toDateString(); // "Mon Feb 02 2026"

                weeklyDataMap.set(dateKey, {
                    name: dayName,
                    date: dateKey, // Store for comparison
                    Order_Placed: 0,
                    Order_Completed: 0
                });
            }

            console.log(`Processing ${allOrders.length} orders for dashboard...`);

            allOrders.forEach(order => {
                // Debug parsing
                if (order.shipment) {
                    // console.log(`Order ${order._id} Date: ${order.shipment.getDate}, Status: ${order.status}`);
                }

                // Use shipment.getDate. Try to parse it.
                // Format in AllOrders.js seemed to be interpretable by new Date().
                if (order.shipment && order.shipment.getDate) {
                    const orderDate = new Date(order.shipment.getDate);
                    const dateKey = orderDate.toDateString();

                    if (weeklyDataMap.has(dateKey)) {
                        const dayStats = weeklyDataMap.get(dateKey);
                        dayStats.Order_Placed += 1; // Count as placed
                        if (order.status === 'Order Completed') {
                            dayStats.Order_Completed += 1;
                        }
                    } else {
                        // console.log(`Date ${dateKey} not in last 7 days range`);
                    }
                }
            });

            const weeklyData = Array.from(weeklyDataMap.values());

            res.send({ pieData, weeklyData });

        } catch (err) {
            console.error("Error generating dashboard stats:", err);
            res.status(500).send({ error: "Failed to fetch dashboard stats" });
        }
    });

});

// --- Email Endpoint ---


app.get('/', (req, res) => {
    res.send('Clean Fold Backend with Local MongoDB is running. Go to /products to see data.');
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
