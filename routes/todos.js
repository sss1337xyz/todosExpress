var express = require('express');
var router = express.Router();
const prisma = require('../prisma/prisma');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
        const todos = await prisma.todos.findMany()
        res.json(todos)

    } catch (error) {
        res.status(500).json({error: 'Error fetching todos'})
    }
});

module.exports = router;
