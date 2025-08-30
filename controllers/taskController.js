const Task = require('../models/taskModels')
const asynchandler = require('express-async-handler')
let id = 1
const getAllTasks = asynchandler(async (req,res)=>{
        const task = await Task.find({user_id: req.user.user_id})
        console.log(req.user)
        if(task.length===0){
                throw new Error("No tasks available");
        }
        res.json(task)
})

const postTask = asynchandler(async (req, res) => {
        const {taskname, deadline} = req.body;
        const user_id = req.user.user_id
        if (!taskname || !deadline) {
            throw new Error("All fields are required in Tasks");
        }
        const task = await Task.create(
                {taskname,
                deadline,
                user_id,
                task_id:id++
                })
        res.json({message:`Task created for user ${req.user.name}`}, task);
})

const getTaskById = asynchandler(async (req,res)=>{
        const task = await Task.findById(req.params.id)
        if(!task){
                throw new Error("Task doesn't exist");
        }
        res.json(task)
})

const updateTask = asynchandler(async (req,res)=>{
        const { taskname, deadline } = req.body;
        if (!taskname || !deadline) {
            throw new Error("All fields are required in Tasks");
        }
        const task = await Task.findById(req.params.id)
        if(!task){
                throw new Error("Task doesn't exist");
        }
        const newTask = await Task.findByIdAndUpdate(req.params.id, {taskname, deadline}, {new:true})
        res.json({message: "Task Updated to "},newTask)
})

const deleteTask = asynchandler(async (req,res)=>{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
                throw new Error("Task doesn't exist");
        }
        res.status(202).json({message: "Task deleted: \n"}, task)
})

module.exports = {getAllTasks, getTaskById , 
                postTask, updateTask, 
                deleteTask}
