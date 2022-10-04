const port = 4000

const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = ((request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    

    if(index < 0) {
        return response.status(404).json({ error: "User Not Found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
})

const method = ((request, response, next) => {
    console.log(request.method, request.url)

    next()
})


app.post('/orders', method, (request, response) =>{
    const {  order, clientName, price } = request.body

    const newOrder = { id:uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(newOrder)

    return response.status(201).json(orders)
})

app.get('/orders', method, (request, response) => {
    return response.json(orders)
})

app.put('/orders/:id', checkOrderId, method, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const { order, clientName, price, status} = request.body

    const alteredOrder = { id, order, clientName, price, status }

    orders[index] = alteredOrder

    return response.json(alteredOrder)

})

app.delete('/orders/:id', checkOrderId, method, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)

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
    const { order, clientName, price} = request.body

    const newStatus = { id, order, clientName, price, status:"Pronto" }

    orders[index] = newStatus

    return response.json(newStatus)
})










app.listen(port, () =>{
    console.log(`🚀Server Started on port ${port}🚀`)
})