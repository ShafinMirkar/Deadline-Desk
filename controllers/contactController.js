const Contact = require('../models/contactModels')
const asynchandler = require('express-async-handler')

const getContacts = asynchandler(async (req,res)=>{
        const contact = await Contact.find({user_id: req.user.id})
        if(contact.length===0){
                throw new Error("No contacts available");
        }
        res.json(contact)
})

const postContact = asynchandler(async (req, res) => {
        const { name, email, number } = req.body;
        if (!name || !email || !number) {
            throw new Error("All fields are required");
        }
        const contact = await Contact.create(
                {name, 
                email, 
                number,
                user_id: req.user.id
                })
        res.json({message:"Contact created"}, contact);
})

const getContactById = asynchandler(async (req,res)=>{
        const contact = await Contact.findById(req.params.id)
        if(!contact){
                throw new Error("Contact doesn't exist");
        }
        res.json(contact)
})

const updateContact = asynchandler(async (req,res)=>{
        const { name, email, number } = req.body;
        if (!name || !email || !number) {
            throw new Error("All fields are required");
        }
        const contact = await Contact.findById(req.params.id)
        if(!contact){
                throw new Error("Contact doesn't exist");
        }
        const newContact = await Contact.findByIdAndUpdate(req.params.id, {name, email, number}, {new:true})
        res.json({message: "Contact Updated to "},newContact)
})

const deleteContact = asynchandler(async (req,res)=>{
        const contact = await Contact.findByIdAndDelete(req.params.id)
        if(!contact){
                throw new Error("Contact doesn't exist");
        }
        res.status(202).json({message: "Contact deleted: \n"}, contact)
})

module.exports = {getContacts, getContactById , 
                postContact, updateContact, 
                deleteContact}
