import { useState, useEffect } from 'react'
import Person from './components/Person'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message) {
    
  return (
    <div className="success">
      {message}
    </div>
  )
}}

const PersonForm = (props) => {
return (
  <form onSubmit={props.addPerson}>

    <div>name: <input value={props.newName}
    onChange={props.handlePersonChange} /></div>
    <div>number: <input value={props.newNumber}
    onChange={props.handleNumberChange} /></div>

    <div><button type="submit">add</button></div>
    </form>
)
}
const RenderAllPersons = (props) => {
  return (
    <ul>
          {props.persons.map(person => 
            <Person key={person.id} person={person} 
            deletePerson={() => props.deletePersonId(person.id)}
            
            />
          )}
        </ul>
  )
}
const RenderPerson = (props) => {
  return (
    <p>{props.name} {props.number} </p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        console.log('Promise granted')
        setPersons(response.data)
      })
  }, [])

  const deletePersonId = (id) => {
    
    console.log('Pressed the delete button of id:  ' + id)
    const person = persons.find(p => p.id === id)

    if(window.confirm("Do you want to delete ")) {
      console.log(person.id)
    
      personService
      .del(id)
      
      .then(response => {        
        setSuccessMessage('Deleting ' + person.name + '...')

        setTimeout(() => {
          window.location.reload(false);
          setSuccessMessage(null)
        }, 5000 )
      })
    }
    
  }

  const findPersons = (newName) => {
    if(persons.map(x => x.name).includes(newName)) {
      alert(newName + " is already added to phonebook.")
      setNewName('');
      setNewNumber('');
      return true;
    }
    return false;
  }

  const addPerson = (event, response) => {
    event.preventDefault();

     if(findPersons(newName) === false ) {
    
    const personObj = {
      name: newName,
      number: newNumber,

    }
    personService
    .create(personObj)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')

      setSuccessMessage(
        'Adding ' + personObj.name + '..')
        
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)


    })
   
    .catch(error => {
  
        let errorMsg = error.response.data
        errorMsg = JSON.stringify(errorMsg);
    
      setSuccessMessage(errorMsg)
      setTimeout(() => {
        setSuccessMessage(null)
        setNewName('')
        setNewNumber('')
      }, 5000)
    })
  }}

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
    <div>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber}
      handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange} />
      <h2>Names & Numbers</h2>
      <RenderAllPersons persons={persons} deletePersonId={deletePersonId}  />
      <RenderPerson name={persons.name} />
    </div>
    </div>
  )
}
export default App