import jwt from 'jsonwebtoken'

const jwtService = {}

jwtService.genAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d", algorithm:"HS256"})
}

jwtService.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]})
}

jwtService.genAccessTokenDoc = (payload) => {
  return jwt.sign(payload, process.env.DOC_SECRET, {expiresIn: "1d", algorithm:"HS256"})
}

jwtService.verifyTokenDoc = (token) => {
  return jwt.verify(token, process.env.DOC_SECRET, {algorithms: ["HS256"]})
}




export default jwtService