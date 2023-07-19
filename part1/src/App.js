import { useState } from 'react'

const Button = (props) => {
  return (
    <div>
      <button onClick={props.handle}>{props.text}</button>
    </div>
  )
}
const StatisticLine = (props) => {
  return (
    <div>
     <p>{props.text}: {props.value} </p>
    </div>
  )
}

const Statistics = (props) => {

  if(props.good > 0 || props.neutral > 0 || props.bad > 0)

  return (
    <div>
    <h1>Statistics</h1>
    <StatisticLine text="Good" value ={props.good} />
    <StatisticLine text="Neutral" value ={props.neutral} />
    <StatisticLine text="Bad" value ={props.bad} />
    
    <StatisticLine text="All" value ={props.total} />
    <StatisticLine text="Average" value ={props.value / props.total} />
    <StatisticLine text="Positive" value ={props.good / props.total * 100 + "%"} />
    </div>
  )
  return (
    <div>
      <h1>Statistics</h1>
      <p>No feedback given</p>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)
  const [value, setValue] = useState(0)
  

const handleGood = () => {
  setAll(allClicks.concat('G'))
  const updatedGood = good + 1
  setGood(updatedGood)
  setTotal(updatedGood + neutral + bad)
  const updatedValue = value + 1
  setValue(updatedValue)
  console.log("Value is: " + value)
}

const handleNeutral = () => {
  setAll(allClicks.concat('N'))
  const updatedNeutral = neutral + 1
  setNeutral(updatedNeutral)
  setTotal(good + updatedNeutral + bad)
  console.log("Value is: " + value)

}
const handleBad = () => {
  setAll(allClicks.concat('B'))
  const updatedBad = bad + 1
  setBad(updatedBad)
  setTotal(good + neutral + updatedBad)
  const updatedValue = value - 1
  setValue(updatedValue)
  console.log("Value is: " + value)
}
  return (
    <div>
      <h1>Give feedback</h1>
      

      <Button text="Good" handle={handleGood}/> 
      <Button text="Neutral" handle={handleNeutral}/>
      <Button text="Bad" handle={handleBad}/>

      <Statistics good={good} neutral={neutral} bad={bad} total={total} value={value}/>
      
    </div>
  )
}
export default App