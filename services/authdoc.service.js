import prisma from "../config/prisma.js"

const authDocService = {}

authDocService.findUserByUsername = (username)=> {
  return prisma.doctor.findUnique({where: {username}})
}

authDocService.findUserById = (id)=> {
  return prisma.doctor.findUnique({where: {id}, select:{id:true, username:true}})
}

authDocService.createUser = (data)=>{
  return prisma.doctor.create({data})
}

export default authDocService