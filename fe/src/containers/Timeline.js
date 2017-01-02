import TimelineComponent from '../components/Timeline'
import React, { Component } from 'react'

// Cannot use ES6 imports yet
var models = require('../../models/models_pb')

const HOST = 'http://localhost:8008'

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      posts: []
    }

    this.newPost = this.newPost.bind(this)
  }

  fetchPosts () {
    this.setState({
      loading: true
    })

    return fetch(`${HOST}/api/posts`)
      .then(res => {
        return res.arrayBuffer()
      })
      .then(buffer => {
        this.setState({
          loading: false,
          posts: models.Posts.deserializeBinary(buffer)
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  newPost (contents) {
    this.setState({
      loading: true
    })

    const newPost = new models.Post(["", contents])

    return fetch(`${HOST}/api/posts`, {
      method: 'POST',
      body: newPost.serializeBinary()
      })
      .then(res => {
        return res.arrayBuffer()
      })
      .then(buffer => {
        this.state.posts.addPosts(models.Post.deserializeBinary(buffer), 0)

        this.setState({
          loading: false,
          posts: this.state.posts
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  render() {
    if (!this.state.loading) {
      return <TimelineComponent posts={this.state.posts.getPostsList()} newPost={this.newPost} />
    } else {
      return <div>Loading</div>
    }
  }

  componentWillMount() {
    this.fetchPosts()
  }
}

export default Timeline
