const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u32oa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toolsCollection = client.db("safety_tools").collection("tools");
    const reviewCollection = client.db("safety_tools").collection("reviews");
    const purchaseCollection = client.db("safety_tools").collection("purchase");
    const userCollection = client.db("safety_tools").collection("users");

    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = toolsCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });

    app.get("/tools/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolsCollection.findOne(query);
      res.send(tool);
    });

    // update tool
    app.put("/tools/:id", async (req, res) => {
      console.log(req.body);
      console.log(req.body.avaQuantity);
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          avaQuantity: updatedUser.avaQuantity,
        },
      };
      const result = await toolsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // delete
    app.delete("/tools/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await toolsCollection.deleteOne(query);
      res.send(result);
    });

    // post
    app.post("/tools", async (req, res) => {
      const newTool = req.body;
      const result = await toolsCollection.insertOne(newTool);
      res.send(result);
    });

    app.get("/allOrders", async (req, res) => {
      const result = await purchaseCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/purchase", async (req, res) => {
      const user = req.query.user;
      const query = { user: user };
      const authorization = req.headers.authorization;
      console.log(authorization);
      const purchases = await purchaseCollection.find(query).toArray();
      res.send(purchases);
    });

    // post
    app.post("/purchase", async (req, res) => {
      const purchase = req.body;
      const result = await purchaseCollection.insertOne(purchase);
      res.send(result);
    });

    // delete
    app.delete("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await purchaseCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // post
    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });

    // put
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // res.send(result);
      // const token = jwt.sign(
      //   { email: email },
      //   process.env.ACCESS_TOKEN_SECRET,
      //   { expiresIn: "1h" }
      // );
      // res.send({ result, token });
    });

    //  make admin

    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await userCollection.find(filter).toArray();
      if (result) {
        const documents = await userCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
        console.log(documents);
      }
    });

    // check admin or not
    app.get("/checkAdmin/:email", async (req, res) => {
      const result = await userCollection
        .find({ email: req.params.email })
        .toArray();
      console.log(result);
      res.send(result);
    });




















    // app.get('/inventory/:id', async(req, res) =>{
    //     const id = req.params.id;
    //     const query={_id: ObjectId(id)};
    //     const inventory = await serviceCollection.findOne(query);
    //     res.send(inventory);
    // });
    // update inventory
    // app.put('/inventory/:id', async(req, res) =>{
    //     console.log(req.body);
    //     console.log(req.body.quantity);
    //     const id = req.params.id;

    //     const updateQuantity = req.body;
    //     const filter = {_id: ObjectId(id)};
    //     const options = { upsert: true };
    //     const updatedDoc = {
    //         $set: {
    //             quantity: updateQuantity.quantity
    //         }
    //     };
    //     const result = await serviceCollection.updateOne(filter, updatedDoc, options);
    //     res.send(result);

    // });

    // app.put('/inventory/:id', async(req, res) =>{
    //     console.log(req.body);
    //     console.log(req.body.quantity);
    //     const id = req.params.id;
    //     const updatedUser = req.body;
    //     const filter = {_id: ObjectId(id)};
    //     const options = { upsert: true };
    //     const updatedDoc = {
    //         $set: {
    //             quantity: updatedUser.quantity
    //         }
    //     };
    //     const result = await serviceCollection.updateOne(filter, updatedDoc, options);
    //     res.send(result);

    // });

    // delete
    // app.delete('/inventory/:id', async(req, res) =>{
    //     const id = req.params.id;
    //     console.log(id)
    //     const query = {_id: ObjectId(id)};
    //     const result = await serviceCollection.deleteOne(query);
    //     res.send(result);
    // })

    // post
    // app.post('/inventory', async(req, res) =>{
    //     const newInventory = req.body;
    //     const result = await serviceCollection.insertOne(newInventory);
    //     res.send(result);
    // });

    // app.get('/inventory/:email', async(req, res)=>{
    //     const result = await serviceCollection.find({
    //         email: req.params.email
    //     }).toArray();
    //     req.send(result);
    // })
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server running Safety Tools");
});

app.listen(port, () => {
  console.log("Port Listening", port);
});
