const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.5fdvbil.mongodb.net/?appName=Cluster0";
const uri =
  "mongodb+srv://assignmentDb:CfaZq5nM93rE1D0S@cluster0.5fdvbil.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("My server is running");
});

async function run() {
  try {
    // await client.connect();

    const usersCollection = client.db("assignmentDb").collection("users");
    const booksCollection = client.db("assignmentDb").collection("books");
    
// Users related api




    app.get("/books", async (req, res) => {
      const cursor = booksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/books/latest", async (req, res) => {
      try {
        const latestBooks = await booksCollection
          .find()
          .sort({ _id: -1 })
          .limit(6)
          .toArray();
        res.send(latestBooks);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch latest books", error });
      }
    });

    app.get("/myBooks/:email", async (req, res) => {
      const email = req.params.email;
      const books = await booksCollection.find({ userEmail: email }).toArray();
      res.send(books);
    });

    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    app.post("/books", async (req, res) => {
      const newBooks = req.body;
      const result = await booksCollection.insertOne(newBooks);
      res.send(result);
    });

    app.patch("/books/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await booksCollection.updateOne(query, {
          $set: updatedBook,
        });
        res.json({ success: result.modifiedCount > 0 });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.delete("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await booksCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json({ success: result.deletedCount > 0 });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // optional: await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`My server is running on port: ${port}`);
});
