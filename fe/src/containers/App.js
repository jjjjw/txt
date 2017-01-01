import AppComponent from '../components/App'
import React, { Component } from 'react'

// Cannot use ES6 imports yet
var models = require('../../models/models_pb')

const HOST = 'http://localhost:8008'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      posts: []
    }
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

  render() {
    if (!this.state.loading) {
      return <AppComponent posts={this.state.posts.getPostsList()} />
    } else {
      return <div>Loading</div>
    }
  }

  componentWillMount() {
    this.fetchPosts()
  }
}

export default App
