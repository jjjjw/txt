import React, { Component } from 'react'
import './App.css'

class PostEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contents: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          New Post:
          <input type='text' value={this.state.contents} onChange={this.handleChange} />
        </label>
        <input type='submit' value='Submit' />
      </form>
    )
  }

  handleSubmit (ev) {
    ev.preventDefault()
    this.props.newPost(this.state.contents)
  }

  handleChange (ev) {
    this.setState({
      contents: ev.currentTarget.value
    })
  }
}

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

function Timeline (props) {
  return (
    <div>
      <PostEditor newPost={props.newPost} />
      <Posts posts={props.posts} />
    </div>
  )
}

export default Timeline
