import prisma from "../config/prisma.js"

const authService = {}

authService.findUserByUsername = (username)=> {
  return prisma.user.findUnique({where: {username}})
}

authService.findUserById = (id)=> {
  return prisma.user.findUnique({where: {id}, select:{id:true, username:true}})
}

authService.createUser = (data)=>{
  return prisma.user.create({data})
}

export default authService