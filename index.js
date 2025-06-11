const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
require('dotenv').config()

const port=process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_ROMHATCH_DB}:${process.env.PASS_ROMHATCH_DB}@cluster0.ab8v5sj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to  server	(optional starting in v4.7)
    await client.connect();
  const roomMateCollection=client.db("roomMateDB").collection("roommates");
    const userCollection=client.db("roomMateDB").collection("users");

  // create roommates
  app.post("/roommates",async(req,res)=>{
    const newRoomMates=req.body;
    console.log(newRoomMates);
    const result=await roomMateCollection.insertOne(newRoomMates);
    res.send(result);
  })
  // create users
  app.post("/users",async(req,res)=>{
    const newUser=req.body;
    console.log(newUser);
    const result=await userCollection.insertOne(newUser);
    res.send(result);
  })
  app.get("/users",async(req,res)=>{
    const users=await userCollection.find().toArray()
    res.send(users);
  })
  app.get("/users/:email",async(req,res)=>{
      try {
    const email = req.params.email;
    const query={
      email:email
    }
    const user = await userCollection.findOne(query);

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error fetching user", error });
  }
  })

// read
app.get("/roommates", async (req, res) => {
      try {
        const roommates = await roomMateCollection.find().toArray();
        res.send(roommates);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch roommates" });
      }
    });
    // // read single roommates data
    app.get("/roommates/:id",async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await roomMateCollection.findOne(query);
      res.send(result);
    })
    
    // delete data 
    app.delete("/roommates/:id",async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await roomMateCollection.deleteOne(query);
    res.send(result);
    })

    // update data
  app.put("/roommates/:id",async(req,res)=>{
  const id=req.params.id;
  const filter={_id:new ObjectId(id)};
  const options={upsert:true};
  const updatedRoommate=req.body;
  const updatedDoc={
    $set:updatedRoommate
  };
  const result=await roomMateCollection.updateOne(filter,updatedDoc,options);
  res.send(result);

})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("roomHatch server has find new roomate");
});
app.listen(port,()=>{
    console.log(`roomHatch server is running on port ${port}`);
})