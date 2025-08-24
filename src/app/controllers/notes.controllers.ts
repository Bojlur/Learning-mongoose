import express, { Request, Response } from "express";
import { Note } from "../models/notes.model";


export const notesRoutes = express.Router();

notesRoutes.post('/create-note', async (req: Request, res: Response) => {

    const body = req.body;
    //Approach-1 of creating a note
    // const myNotes = new Note({
    //     title: "Learning express",
    //     tags: {
    //         label: "mongoose",
    //     }
    // })
    // await myNotes.save();
    const note = await Note.create(body); //Approach-2 of creating a note

    res.status(201).json({
        success: true,
        message: "Note created successfully",
        note
    })
})


notesRoutes.get('/', async (req: Request, res: Response) => {

    const body = req.body;

    const notes = await Note.find();

    res.status(201).json({
        success: true,
        message: "Note get successfully",
        notes
    })
})
notesRoutes.get('/:noteId', async (req: Request, res: Response) => {

    const noteId = req.params.noteId
    const note = await Note.findById(noteId);
    // const note = await Note.findOne({_id: noteId}); 
    // const note = await Note.findOne({title: "Learning Mongoose"}); 

    res.status(201).json({
        success: true,
        message: "Single Note get successfully",
        note
    })
})
notesRoutes.delete('/:noteId', async (req: Request, res: Response) => {
    const noteId = req.params.noteId;
    const note = await Note.findByIdAndDelete(noteId);
    // const note1 = await Note.findOneAndDelete({_id: noteId});  
    // const note2 = await Note.findOneAndDelete({_id: noteId});  

    res.status(201).json({
        success: true,
        message: "Note deleted successfully",
        note
    })
})

notesRoutes.patch('/:noteId', async (req: Request, res: Response) => {
    const noteId = req.params.noteId;
    const updatedBody = req.body;

    const note = await Note.findByIdAndUpdate(noteId, updatedBody, { new: true });
    // const note = await Note.findOneAndUpdate({_id: noteId}, updatedBody, {new:true}); 
    // const note = await Note.updateOne({_id: noteId}, updatedBody, {new:true}); 

    res.status(201).json({
        success: true,
        message: "Note updated successfully",
        note
    })
})