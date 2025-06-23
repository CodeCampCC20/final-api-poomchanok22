import authDocService from "../services/authdoc.service.js";
import createError from "../utills/create-error.js";
import hashService from "../services/hash.service.js";
import jwtService from "../services/jwt.service.js";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const authControllerDoc = {}

authControllerDoc.registerDoc = async (req, res, next) => {
  try {
    const { username, password, specialization } = req.body
    console.log("req.body",req.body)

    const exitUser = await authDocService.findUserByUsername(username)
    console.log("exitUser", exitUser)

    if(exitUser){
      createError(400,"already in use")
    }

    const hashPassword = hashService.hashPassword(password)
    console.log("hashPassword", hashPassword)

    const newUser = await authDocService.createUser({username, password:hashPassword, specialization})
    console.log("newUser", newUser)

    res.status(201).json({success: true, newUser: {id: newUser.id, username: newUser.username, specialization: newUser.specialization}})

  } catch (error) {
    next(error)
  }
}



authControllerDoc.loginDoc = async (req, res, next) => {
  try {
    const { username, password} = req.body
  
    const existUser = await authDocService.findUserByUsername(username)
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

      const accessToken = jwtService.genAccessTokenDoc(payload)
      console.log("accessToken", accessToken)

      res.status(200).json({success: true, accessToken})
   
  } catch(error){
    next(error)
  }
}

authControllerDoc.getUser = (req,res) => {
  res.status(200).json({success: true, doctor: req.doctor})
}


authControllerDoc.editDoc = async(req, res, next) => {
try{
const {id} = req.doctor
const {username, password, specialization} = req.body
const hashPassword = await bcrypt.hash(password, 10)
const doctor = await prisma.doctor.update({
  where:{ id },
  data:{
    username,
    password: hashPassword,
    specialization
  }
})
console.log(id,username)
res.json({ message: "This is update Username"})
} catch (error) {
  next(error)
}
}

authControllerDoc.createDoctor = async(req, res, next) => {
  try{
    const { userId, note } = req.body

    const isUser = await prisma.user.findFirst({
      where:{id: Number(userId)}
    })
    if(!isUser){
      createError(400,"User does't exist")
    }
    await prisma.doctorNote.create({
      data:{
        userId: isUser.id,
        note,
        doctorId: req.doctor.id
      }
    })
    res.status(200).json({message: "Create Successfully"})
  } catch(error){
    next(error)
  }
}



export default authControllerDoc