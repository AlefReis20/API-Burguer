const port = 4000

const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const orders = []

const checkOrderId = ((request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order Not Found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
})

const method = ((request, response, next) => {
    console.log(request.method, request.url)

    next()
})

app.post('/orders', method, (request, response) => {
    const { order, name, price } = request.body

    const newOrder = { id: uuid.v4(), order, name, price, status: "Em preparação" }

    orders.push(newOrder)

    return response.status(201).json(orders)
})

app.get('/orders', method, (request, response) => {
    return response.json(orders)
})

app.put('/orders/:id', checkOrderId, method, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const { order, name, price, status } = request.body

    const alteredOrder = { id, order, name, price, status }

    orders[index] = alteredOrder

    return response.json(alteredOrder)

})
app.delete('/orders/:id', checkOrderId, method, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/orders/:id', checkOrderId, method, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex
    const order = orders[index]

    return response.json(order)
})

app.patch('/orders/:id', checkOrderId, method, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId

    const readyOrder = orders[index]
    readyOrder.status = "Pronto"

    orders[index] = readyOrder

    return response.json(orders)
})
app.listen(process.env.PORT || port)