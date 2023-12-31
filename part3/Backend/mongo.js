const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.idos3fv.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)


const person = new Person({
  name: process.argv[3],
  number: process.argv[4]

})


if(!process.argv[3] && !process.argv[4] && process.argv[2]) {

  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name)
      mongoose.connection.close()
    })
  })
}

if(process.argv[2] && process.argv[3] && process.argv[4]) {
  person.save().then(() => {
    console.log('Added ' + person.name + ' number ' + person.number + ' to phonebook.')
    mongoose.connection.close()
  })}