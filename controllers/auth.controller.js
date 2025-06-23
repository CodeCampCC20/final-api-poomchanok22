import authService from "../services/auth.service.js";
import createError from "../utills/create-error.js";
import hashService from "../services/hash.service.js";
import jwtService from "../services/jwt.service.js";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const authController = {}

authController.register = async (req, res, next) => {
  try {
    const { username, password } = req.body
    console.log("req.body",req.body)

    const exitUser = await authService.findUserByUsername(username)
    console.log("exitUser", exitUser)

    if(exitUser){
      createError(400,"already in use")
    }

    const hashPassword = hashService.hashPassword(password)
    console.log("hashPassword", hashPassword)

    const newUser = await authService.createUser({username, password:hashPassword})
    console.log("newUser", newUser)

    res.status(201).json({success: true, newUser: {id: newUser.id, username: newUser.username}})

  } catch (error) {
    next(error)
  }
}



authController.login = async (req, res, next) => {
  try {
    const { username, password} = req.body
  
    const existUser = await authService.findUserByUsername(username)
      console.log("existUser:", existUser)

      if(!existUser) {
        createError(400, "Invalid user")
      }

      const isMatchPassword = hashService.comparePassword(
        password, 
        existUser.password
      )
      console.log("isMatchPassword", isMatchPassword)

      const payload = {id: existUser.id}

      const accessToken = jwtService.genAccessToken(payload)
      console.log("accessToken", accessToken)

      res.status(200).json({success: true, accessToken})
   
  } catch(error){
    next(error)
  }
}

authController.getUser = (req,res) => {
  res.status(200).json({success: true, user: req.user})
}


authController.editUser = async(req, res, next) => {
try{
const {id} = req.user
const {username, password} = req.body
const hashPassword = await bcrypt.hash(password, 10)
const user = await prisma.user.update({
  where:{id},
  data:{
    username,
    password: hashPassword
  }
})
console.log(id,username)
res.json({ message: "This is update Username"})
} catch (error) {
  next(error)
}

  
}

authController.createHealthRecord = async(req, res, next) => {
  try {
    const {type, value} = req.body
    if (!type || !value) {
      createError(400, "Invalid Input")
    }

    await prisma.healthRecord.create({
      data:{
        type,
        value,
        userId: req.user.id
      }
    })
    res.status(201).json({message: "Create Successfully"})
  } catch(error){
    next(error)
  }
}

authController.getRecord = async(req, res, next) => {
  try {
    const records = await prisma.healthRecord.findMany({
      where:{
        userId: req.user.id
      }
    }) 
    res.status(200).json({message:"Get Record Successfully",records})
  } catch (error) {
    next(error)
  }
}

authController.getRecordById = async(req, res, next) => {
  try {
    const {id} = req.params
    const recordById = await prisma.healthRecord.findFirst({
      where: { id: Number(id)}
    })

    if(!recordById) {
      createError(400,"Record does't exist!")
    }

    res.status(200).json({message:`Get Record By Id Successfully`,recordById})
  } catch (error) {
    next (error)
  }
}

authController.editRecordById = async(req, res, next) =>{
  try {
    const {id} = req.params
    const {type, value} = req.body

    const isRecord = await prisma.healthRecord.findFirst({
      where:{id: Number(id)}
    })
    if(!isRecord){
      createError(400,"Record does't exist")
    }

    const editRecord = await prisma.healthRecord.update({
      where:{id: Number(id)},
      data:{
        type,
        value
      }
    })
    res.status(200).json({message:`Edit Successfully : `,editRecord:{type, value}})

  } catch(error) {
    next(error)
  }
}

authController.deleteRecordById = async(req, res, next)=>{
  try {
    const { id } = req.params
    const isRecord = await prisma.healthRecord.findFirst({
      where:{id: Number(id)}
    })
    if (!isRecord) {
      createError(400, "Can not Delete")
    }
    await prisma.healthRecord.delete({
      where:{id: Number(id)}
    })
    res.status(200).json({message: "This Record is Deleted"})
  } catch (error) {
    next(error)
  }
}


export default authController