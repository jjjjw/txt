import PostEditor from './PostEditor'
import React from 'react'

import './Timeline.css'

function Posts (props) {
  return (
    <ul className='Posts'>
      {props.posts.map(post => <Post key={post.getId()} post={post} />)}
    </ul>
  )
}

function Post (props) {
  return (
    <li className='Post'>
      {props.post.getContents().getBlocksList().map(block =>
        <div key={block.getKey()}>{block.getText()}</div>
      )}
    </li>
  )
}

function Timeline (props) {
  return (
    <div className='Timeline'>
      <PostEditor newPost={props.newPost} />
      <Posts posts={props.posts} />
    </div>
  )
}

export default Timeline
