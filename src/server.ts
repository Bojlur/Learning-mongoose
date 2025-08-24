import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";

let server: Server;
const PORT = 5000;

async function main() {
    try {
        await mongoose.connect("mongodb+srv://mongodb:mongodb@cluster0.bmesl.mongodb.net/Learning-mongoose?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to MongoDB");
        server = app.listen(PORT, () => {
            console.log(`Server is running on:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
main();