import express, { Application, Request, Response } from "express";
import { model, Schema } from "mongoose";


const app: Application = express();

app.use(express.json());

const noteSchema = new Schema({
    title: String,
    content: String
})

const Note = model("Note", noteSchema);

app.post('/create-note', async(req: Request, res: Response) => {
    const myNotes = new Note({
        title: "Learning mongoose",
        content: "Mongoose is a great ODM for MongoDB"
    })
    await myNotes.save();
    
    res.status(201).json({
        success: true,
        message: "Note created successfully",
        note: myNotes
    })
})

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Learning Mongoose API");
});

export default app;