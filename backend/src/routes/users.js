const express = require('express')
const router = express.Router()

// GET /api/users - Get all users
router.get('/', (req, res) => {
    res.json({
        message: 'Users endpoint',
        users: []
    })
})

module.exports = router