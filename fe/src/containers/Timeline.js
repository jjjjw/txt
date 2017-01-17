import Immutable from 'immutable'
import React, { Component } from 'react'
import TimelineComponent from '../components/Timeline'

// Cannot use ES6 imports yet
var models = require('../../models/models_pb')

const SCHEME = 'http://'
const HOST = 'localhost:8008'

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      posts: Immutable.List()
    }

    this.newPost = this.newPost.bind(this)
    this.onMessage = this.onMessage.bind(this)
  }

  fetchPosts () {
    this.setState({
      loading: true
    })

    return fetch(`${SCHEME}${HOST}/api/posts`)
      .then(res => {
        return res.arrayBuffer()
      })
      .then(buffer => {
        let posts = models.Posts.deserializeBinary(buffer).getPostsList()
        posts = this.state.posts.push(...posts)

        this.setState({
          loading: false,
          posts
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  openStream () {
    this.socket = new WebSocket(`ws://${HOST}/ws`)
    this.socket.binaryType = 'arraybuffer'

    this.socket.onmessage = this.onMessage
  }

  onMessage (event) {
    const buffer = event.data

    // Only one message type for now
    const post = models.Post.deserializeBinary(buffer)
    const posts = this.state.posts.push(post)

    this.setState({
      posts
    })
  }

  closeStream () {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  newPost (contents) {
    this.setState({
      loading: true
    })

    const newPost = new models.Post(['self', contents])

    return fetch(`${SCHEME}${HOST}/api/posts`, {
        method: 'POST',
        body: newPost.serializeBinary()
      })
      .then(res => {
        return res.arrayBuffer()
      })
      .then(buffer => {
        const post = models.Post.deserializeBinary(buffer)
        const posts = this.state.posts.push(post)

        this.setState({
          loading: false,
          posts
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  render() {
    if (!this.state.loading) {
      return <TimelineComponent posts={this.state.posts} newPost={this.newPost} />
    } else {
      return <div>Loading</div>
    }
  }

  componentWillMount() {
    this.fetchPosts()
    this.openStream()
  }

  componentWillUnmount() {
    this.closeStream()
  }
}

export default Timeline
