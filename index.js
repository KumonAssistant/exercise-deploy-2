const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "dan abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "mary poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// alternative logger (manual)
const reqLogger = (req, res, next) => {
  console.log(`Method: ${req.method}\nPath: ${req.path}\nBody: ${JSON.stringify(req.body)}`)
  next()
}
//app.use(reqLogger)

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`Phonebook has info for ${persons.length} people<br><br>${date}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  console.log('starting')
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    console.log('repeat')
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  console.log('no error, has body')
  const person = {
    id: crypto.randomUUID(),
    name: body.name,
    number: body.number,
  }

  console.log('created person')
  persons = persons.concat(person)
  console.log('added to list')
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({
    error: 'unknown endpoint'
  })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
