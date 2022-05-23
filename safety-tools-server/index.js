const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u32oa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db('safety_tools').collection('tools');
        const reviewCollection = client.db('safety_tools').collection('reviews');

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
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

    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server running Safety Tools');
});

app.listen(port, () => {
    console.log('Port Listening', port);
});
