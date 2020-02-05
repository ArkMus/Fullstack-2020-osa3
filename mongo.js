const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-wnaa9.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

const Person = mongoose.model('Person', PersonSchema)

if (name == undefined) {
    Person.find({}).then(result => {
        result.forEach(Person => {
            console.log(Person)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(response => {
        console.log(`added ${name} number ${number} to the phonebook`);
        mongoose.connection.close();
    })
}

