import {
  Editor,
  EditorState } from 'draft-js'
import React, { Component } from 'react'

import './PostEditor.css'

export default class PostEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render () {
    return (
      <div className='PostEditor'>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
        <button className='btn' onClick={this.onSubmit}>Post</button>
      </div>
    )
  }

  onSubmit () {
    this.props.newPost(
      this.state.editorState.getCurrentContent()
    )
  }

  onChange (editorState) {
    this.setState({ editorState })
  }
}
