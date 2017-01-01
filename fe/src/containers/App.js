import AppComponent from '../components/App'
import React, { Component } from 'react'

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
        return res.text()
      })
      .then(posts => {
        debugger
        console.log(posts)
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
    if (this.state.loading) {
      return <AppComponent posts={this.state.posts} />
    } else {
      return <div>Loading</div>
    }
  }

  componentWillMount() {
    this.fetchPosts()
  }
}

export default App
