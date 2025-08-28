import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import z from "zod";
import bcrypt from "bcryptjs";



export const usersRoutes = express.Router();

const CreateUserZodSchema = z.object(
    {
        firstName: z.string(),
        lastName: z.string(),
        age: z.number(),
        email: z.string(),
        password: z.string(),
        role: z.string().optional()
    }
)

usersRoutes.post('/create-user', async (req: Request, res: Response) => {

    try {
        //zod validation
        //  const zodBody = await CreateUserZodSchema.parseAsync(req.body);
        const body = req.body;
        //  console.log(body, "zod body")
        //Built in custom instance method password hashing
        //  const password = await bcrypt.hash(body.password, 10);
        //  console.log(password);
        //     body.password = password;
        
        
        // Hash the password before creating the user
        // const hashedPassword = await bcrypt.hash(body.password, 10);
        // body.password = hashedPassword;
        // const user = new User(body);
        // await user.save();

        //built in custom static method password hashing
        // const password = await User.hashPassword(body.password);
        // console.log(password, "static")
        // body.password = password;
        const user = await User.create(body); //Approach-2 of creating a user

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user
    })
        
    } catch (error:any) {
        console.log(error);
        res.status(400).json({
        success: false,
        message: error.message,
        error
    })
        
    }
})


usersRoutes.get('/', async (req: Request, res: Response) => {

    const body = req.body;
    // const users = await User.find();

    //sorting
    // const users = await User.find().sort({"email": "ascending"});
    // const users = await User.find().sort({"email": "descending"});

    //skipping
    // const users = await User.find().skip(8);

    //limit
    const users = await User.find().limit(2);

    res.status(201).json({
        success: true,
        message: "Users retrieved successfully",
        users
    })
})
usersRoutes.get('/:userId', async (req: Request, res: Response) => {

    const userId = req.params.userId
    const user = await User.findById(userId); 

    res.status(201).json({
        success: true,
        message: "Single User retrieved successfully",
        user
    })
})
usersRoutes.delete('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    // const user = await User.findByIdAndDelete(userId); 
    const user = await User.findOneAndDelete({ _id: userId });

    res.status(201).json({
        success: true,
        message: "User deleted successfully",
        user
    })
})

usersRoutes.patch('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const updatedBody = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedBody, { new: true });

    res.status(201).json({
        success: true,
        message: "User updated successfully",
        user
    })
})