const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const topics=["General","Partnership","Campus Pilot","Support"];
const statuses=["new","in_progress","closed"];

const contactSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            minlength:2,
            maxlength:120,
            trim:true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"] //Validation
        },
        topic:{
            type:String,
            enum:topics,
            required:true
        },
        message:{
            type:String,
            required:true,
            minlength:1,
            maxlength:10000,
            trim:true
        },
        status:{
            type:String,
            enum:statuses,
            default:"new",
            index:true
        },
        notes: { 
            type: String, 
            default: "" 
        },
        source: { 
            type: String, 
            default: "contact.html" 
        },
        meta: {
        ip: String,
        userAgent: String,
        referrer: String
        },
        consent: { 
            type: Boolean, 
            default: true 
        }
    },
    { timestamps: true }
);


const Contact = mongoose.model("Contact",contactSchema);
module.exports = Contact;
