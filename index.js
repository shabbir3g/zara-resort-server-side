const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;




// middleware 

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5fxi2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("zaraResort");
        const servicesCollection = database.collection('services');
        const bookingCollection = database.collection('booking');

        // GET Services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });

        // post Services
        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });

         // post booking
            app.post('/booking', async(req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        });

          //GET SINGLE service 

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service)
        });
        //GET all booking by email 
        app.get('/my-orders/:email', async (req, res) => {
            const email = req.params.email;
            const service = await bookingCollection.find({email: email}).toArray();
            res.json(service)
        });

        //GET all booking
        app.get('/ManageAllOrders', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking)
        });
        // Delete booking
        app.delete('/booking/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query);
            console.log('deleting users with id', result);
            res.json(result)
          });
        

        // update status
        app.put('/udpate/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updatedDoc = {
              $set: {
                status: "Approved"
              },
           };
            const result = await bookingCollection.updateOne(filter,updatedDoc, options );

            res.json(result);
        })

        



    }
    finally{
       // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Zara resort Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
