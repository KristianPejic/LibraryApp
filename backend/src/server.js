const app = require('./app')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`)
    console.log(`📖 API available at http://localhost:${PORT}`)
})