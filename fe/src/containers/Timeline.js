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
      posts: Immutable.List(),
      postIds: Immutable.Set()
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
        this.addPosts(models.Posts.deserializeBinary(buffer).getPostsList())

        this.setState({
          loading: false
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
    const notification = models.Notification.deserializeBinary(event.data)

    if (notification.hasPosts()) {
      this.addPosts(notification.getPosts().getPostsList())
    }
  }

  closeStream () {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  newPost (contentState) {
    this.setState({
      loading: true
    })

    const newPost = new models.Post([
      'new',
      [
        contentState.getBlockMap().map(block =>
          [block.getKey(), block.getText()]
        ).toArray()
      ]
    ])

    return fetch(`${SCHEME}${HOST}/api/posts`, {
        method: 'POST',
        body: newPost.serializeBinary()
      })
      .then(res => {
        return res.arrayBuffer()
      })
      .then(buffer => {
        const post = models.Post.deserializeBinary(buffer)
        this.addPosts([post])

        this.setState({
          loading: false
        })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  addPosts (posts) {
    this.setState(state => {
      // Check that we don't already have the post
      posts = posts.filter(post => !state.postIds.has(post.getId()))

      return {
        posts: state.posts.unshift(...posts),
        postIds: state.postIds.add(...posts.map(post => post.getId()))
      }
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
