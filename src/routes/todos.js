import express from 'express';
var router = express.Router();
import prisma from '../../prisma/prisma.js';

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
        const todos = await prisma.todos.findMany()
        res.json(todos)

    } catch (error) {
        res.status(500).json({error: 'Error fetching todos'})
    }
});

export default router;
