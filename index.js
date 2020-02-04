const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('person', req => {
    return JSON.stringify(req.body)
  })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

const cors = require('cors')

app.use(cors())


let persons = [{
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]


app.get('/', (req, res) => {
    res.send('<h1>Hello Tron!</h1>')
})

app.get('/info', (req, res) => {
    let date = new Date()
    let body = `<p>Phonebook has info for ${persons.length} people<p/>
    ${date}
    `
    res.send(body)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * Math.floor(9999)); 
    return id
}

const isPerson = (name) => {
    let ret = false
    persons.forEach(e => {
        if(e.name == name){
            ret = true
        }
    })
    return ret
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number || !body.name && !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }

    if(isPerson(body.name)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})