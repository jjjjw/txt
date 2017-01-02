import React from 'react'
import './App.css'

function App (props) {
  return (
    <div className='App'>
      <div>
        <h2>Welcome</h2>
      </div>
      {props.children}
    </div>
  )
}

export default App
