import React, { Component } from 'react'
import logo from '../logo.svg'
import './App.css'

function Posts (props) {
  return (
    <div>
      {props.posts.map(post => {
        return (
          <div>
            {post.contents}
          </div>
        )
      })}
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome</h2>
        </div>
        <Posts posts={this.props.posts} />
      </div>
    )
  }
}

export default App
