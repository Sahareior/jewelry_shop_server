const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://jewelry_shop:wc87tyEliEgIWaph@cluster0.j0rll9s.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function startServer() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("Jewelry_Shop");

    const productCollections = db.collection("All_Products");
    const userCollections = db.collection("Users");

    // Define your routes and perform operations here
    app.get('/products', async (req, res) => {
      try {
        const data = await productCollections.find().toArray();
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/products/:email', async (req,res)=>{
      const query = req.params.email
      // console.log(query)
      const obj = {email: query}
      const result = await productCollections.find(obj).toArray()
      res.send(result)
    })

    app.post( '/users', async(req,res)=>{
     
      const name = req.body.name 
      const email = req.body.email
      const uid = req.body.uid
      const inseretdata = {name,uid,email, admin: false}
      const result = await userCollections.insertOne(inseretdata)
      res.send(result)
    })


    app.post ('/add', async(req,res)=>{
      const data ={
        name: req.body.name,
         price: req.body.price,
          date: req.body.date,
           email:req.body.email,
            image:req.body.image,
             category:req.body.category
      }
      const result = await productCollections.insertOne(data)
      res.send(result)
    })
    // Start the Express server
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the function to start the server
startServer();
