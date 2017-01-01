import React, { Component } from 'react'
import './App.css'

function Posts (props) {
  return (
    <div>
      {props.posts.map((post, ii) => {
        return (
          <div key={ii}>
            {post.getContents()}
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
        <div>
          <h2>Welcome</h2>
        </div>
        <Posts posts={this.props.posts} />
      </div>
    )
  }
}

export default App
