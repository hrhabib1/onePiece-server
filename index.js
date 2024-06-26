const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middlewire
app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nwzqkqi.mongodb.net/?retryWrites=true&w=majority`;

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

    const addSellPosts = client.db('addPost').collection('item');
    const orderCollection = client.db('addPost').collection('orders');


    app.post('/addSellPost', async(req, res) =>{
        const addSellPost = req.body;
        console.log(addSellPost);
        const result = await addSellPosts.insertOne(addSellPost);
        res.send(result);
      })
      
      app.get('/addSellPost', async(req, res) =>{
        const cursor = addSellPosts.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/addSellPost/:id', async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const options = {
            projection: {title: 1, image: 1,  priceKilo: 1, price: 1},
        };

        const result = await addSellPosts.findOne(query, options);
        res.send(result);
      })

      // order
      app.post('/orders', async(req, res) =>{
        const addOrder = req.body;
        console.log(addOrder);
        const result = await orderCollection.insertOne(addOrder);
        res.send(result);
      })
      app.get('/orders', async(req, res) =>{
        let query = {};
        if(req.query?.email){
          query = {email: req.query.email}
        }
        const result = await orderCollection.find(query).toArray();
        res.send(result);
      })
      app.delete('/orders/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        res.send(result);
      })

      app.patch('/orders/:id', async(req, res)=> {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const updatedOrder = req.body;
        console.log(updatedOrder);
        const updateDoc = {
          $set: {
            status: updatedOrder.status
          },
        };
        const result = await orderCollection.updateOne(filter, updateDoc);
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
    res.send('This server is running')
})
app.listen(port, () => {
    console.log(`This server is runig on port ${port}`)
})