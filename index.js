const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion,  ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json());

// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktgpsav.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
 
    await client.connect();

    const productsCollection = client.db("ecommerce-test").collection("products")
    const ordersCollection = client.db("ecommerce-test").collection("orders")

    app.get('/v1/allproducts', async(req,res) => {
      const result = await productsCollection.find().toArray()
      res.send(result)
    })

    app.get('/v1/allproducts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.findOne(query)
      res.send(result)
    })

    app.patch('/v1/allproducts/:id',   async(req, res) =>{
      
      const id = req.params.id;
      const upadatedProductData = req.body;
      const query = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set: {
          category : upadatedProductData.category,
          desc : upadatedProductData.desc,
          regular_price: upadatedProductData.regular_price,
          sale_price: upadatedProductData.sale_price,
          title: upadatedProductData.title,
        }
      }
      const result = await productsCollection.updateOne(query, updatedDoc)
      res.send(result)
    })



    app.post('/v1/addproduct', async(req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product)
      res.send(result)
    })
    app.post('/v1/order', async(req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order)
      res.send(result)
    })



    app.delete('/v1/allproducts/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result)
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
  res.send('CRUD practice server is running')
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})