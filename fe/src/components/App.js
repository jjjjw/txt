import React from 'react'
import './App.css'

function App (props) {
  return (
    <div className='App'>
      <div>
        <h2 className='title'>Welcome to the Machine</h2>
      </div>
      {props.children}
    </div>
  )
}

export default App
