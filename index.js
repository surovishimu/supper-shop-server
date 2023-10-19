const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wo3tpaw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const productCollection = client.db("productDB").collection("products");
        const cartProductCollection = client.db("cartCollection").collection("cartProducts");

        // cart data
        app.get('/mycart', async (req, res) => {
            const result = await cartProductCollection.find().toArray();
            console.log(result);
            res.send(result)
        })

        app.post('/mycart', async (req, res) => {
            const cartProduct = req.body;
            const result = await cartProductCollection.insertOne(cartProduct);
            console.log(result);
            res.send(result);
        })
        app.delete('/mycart/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            }
            const result=await cartProductCollection.deleteOne(query);
            res.send(result)
        })


        // product db
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            console.log(result);
            res.send(result);
        })


        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            console.log(result);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('brand shop server running')
})

app.listen(port, () => {
    console.log(`brand shop server running on port ${port}`)
})