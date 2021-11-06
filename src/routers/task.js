const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOps = updates.every((p) => allowedUpdates.includes(p))
    if (!isValidOps) {
        return res.status(400).send({
            error: "Invalid operations"
        })
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((u) => task[u] = req.body[u])
        await task.save()
        res.send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router