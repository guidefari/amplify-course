import { useState, useEffect } from "react"
import { API } from "aws-amplify"
import { listPosts } from "../src/graphql/queries.ts"

export default function Home() {
  const [posts, setPosts] = useState([])

  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts,
    })

    setPosts(postData.data.listPosts.items)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div>
      <h1 className="mb-10 text-4xl font-bold underline">My Posts</h1>
      <div>
        {posts.length > 0 &&
          posts.map(post => <h4 key={post.id}>{post.title}</h4>)}
      </div>
    </div>
  )
}
