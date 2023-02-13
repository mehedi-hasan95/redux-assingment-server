require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k4gmzpi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        const db = client.db("moontech");
        const blogCollection = db.collection("blog");

        app.get("/blogs", async (req, res) => {
            const cursor = blogCollection.find({});
            const blog = await cursor.toArray();

            res.send({ status: true, data: blog });
        });

        app.get("/blog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        });

        app.post("/blog", async (req, res) => {
            const blog = req.body;

            const result = await blogCollection.insertOne(blog);

            res.send(result);
        });

        app.delete("/blog/:id", async (req, res) => {
            const id = req.params.id;

            const result = await blogCollection.deleteOne({
                _id: ObjectId(id),
            });
            res.send(result);
        });

        app.put("/blog/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: req.body,
            };
            const result = await blogCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });
    } finally {
    }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Redux assignment Running on");
});

app.listen(port, () => {
    console.log(`Redux assignment is running on ${port}`);
});
