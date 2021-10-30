const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
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
