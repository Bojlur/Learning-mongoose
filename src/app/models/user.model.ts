import bcrypt from "bcryptjs";
import { Model, model, Schema } from "mongoose";
import { IAddress, IUser, UserInstanceMethods, UserStaticMethods } from "../interfaces/user.interface";
import validator from 'validator';
import { Note } from "./notes.model";

const addressSchema = new Schema<IAddress>({
    city: { type: String },
    state: { type: String },
    zip: { type: Number }
}, { 
    _id: false
});

const userSchema = new Schema<IUser, UserStaticMethods, UserInstanceMethods>({
    firstName: {
         type: String, 
         required: [true, 'First Name is required'], 
         trim: true,
         minlength: [3, 'First Name Must be at least 3 characters, got {VALUE}'],
         maxlength: [10, 'First Name Must be at most 10 characters, got {VALUE}']
     },
    lastName: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: [3, 'Last Name Must be at least 3 characters, got {VALUE}'],
        maxlength: [10, 'Last Name Must be at most 10 characters, got {VALUE}']
    },
    age: { 
        type: Number, 
        required: true ,
        min: [18, 'Age Must be at least 18, got {VALUE}'],
        max: [60, 'Age Must be at most 60, got {VALUE}']
    },
    email: { 
        type: String, 
        required: true,
        unique: [true, 'Email must be unique'],
        lowercase: true, 
        trim: true,
        // validate: {
        //     validator: function(value: string) {
        //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //         return emailRegex.test(value);
        //     },
        //     message: function(props){
        //         return `Email ${props.value} is not a valid email!`;
        //     }
        // },
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
         type: String,
         required: true 
    },
    role: { 
         type: String,
         uppercase: true,
         enum: {
            values: ['USER', 'ADMIN', 'SUPERADMIN'],
            message: '{VALUE} is not a valid role'
         }, 
         default: 'USER' 
    },
    address: {
        type: addressSchema
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}  
});


userSchema.method("hashPassword", async function(plainPassword:string){
    const password = await bcrypt.hash(plainPassword, 10);
    return password;
    
})
userSchema.static("hashPassword", async function(plainPassword:string){
    const password = await bcrypt.hash(plainPassword, 10);
    return password;
    
})

//pre Hooks

//Document Middleware

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//Query middleware

userSchema.pre("find", function(next){
    console.log("Inside Pre Find Hook");
    next();
})

// Post Hook

//Document Middleware

userSchema.post("save", function(doc, next){
    console.log(`${doc.email} has been saved`);
    next();
})

//Query Middleware
userSchema.post("findOneAndDelete", async function(doc, next){
    if(doc){
        console.log(doc);
        await Note.deleteMany({ user: doc._id });
    }
    next();
})

userSchema.virtual("fullName").get(function(){
    return `${this.firstName} ${this.lastName}`;
})

export const User = model<IUser, UserStaticMethods>("User", userSchema);
