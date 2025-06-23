const notFoundMiddleware = (req,res) => {
  res.status(404).json({message: `not found path: ${req.method}, ${req.url}`})
}

export default notFoundMiddleware