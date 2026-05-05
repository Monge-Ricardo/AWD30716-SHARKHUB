require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

// Configurar para recibir JSON
app.use(express.json())

// Configurar directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')))

// Importar controladores
const InfoController = require('./app/controllers/InfoController')
const CustomerController = require('./app/controllers/CustomerController')
const OwnerController = require('./app/controllers/OwnerController')
const BarberController = require('./app/controllers/BarberController')

// Rutas de Información Pública
app.get('/', InfoController.index)
app.get('/about', InfoController.about)
app.get('/service', InfoController.service)
app.get('/price', InfoController.price)
app.get('/team', InfoController.team)
app.get('/testimonial', InfoController.testimonial)
app.get('/contact', InfoController.contact)
app.get('/open', InfoController.open)
app.get('/404', InfoController.notFound)

// Rutas de Cliente
app.get('/customer/dashboard', CustomerController.dashboard)
app.get('/customer/login', CustomerController.login)
app.get('/customer/register', CustomerController.register)
app.get('/customer/profile', CustomerController.profile)

// Rutas de Owner
app.get('/owner/dashboard', OwnerController.dashboard)

// Rutas de Barber
app.get('/barber/dashboard', BarberController.dashboard)

// Rutas API de Barber (CRUD)
app.get('/api/barber/services', BarberController.getServices)
app.post('/api/barber/services', BarberController.createService)
app.put('/api/barber/services/:id', BarberController.updateService)
app.delete('/api/barber/services/:id', BarberController.deleteService)

app.get('/api/barber/products', BarberController.getProducts)
app.post('/api/barber/products', BarberController.createProduct)
app.put('/api/barber/products/:id', BarberController.updateProduct)
app.delete('/api/barber/products/:id', BarberController.deleteProduct)

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'app/views/info/404.html'))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
