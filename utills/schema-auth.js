import * as Yup from "yup"

export const schemaRegister = Yup.object({
  username: Yup.string().min(6).max(30).required(),
  password: Yup.string().min(6).max(30).required()
})

export const schemaRegisterDoctor = Yup.object({
  username: Yup.string().min(6).max(30).required(),
  password: Yup.string().min(6).max(30).required(),
  specialization: Yup.string().min(6).max(30).required()
})