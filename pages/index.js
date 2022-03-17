import { useState, useEffect } from "react"
import { API, graphqlOperation, Storage } from "aws-amplify"
import { listPosts } from "./../src/graphql/queries"
import Link from "next/link"
import { newOnCreatePost } from "./../src/graphql/subscriptions"

export default function Home() {
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState([])

  let subOncreate

  function setUpSubscriptions() {
    subOncreate = API.graphql(graphqlOperation(newOnCreatePost)).subscribe({
      next: postData => {
        console.log(postData.value)
        setPost(postData)
      },
    })
  }
  useEffect(() => {
    setUpSubscriptions()
    return () => {
      subOncreate.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [post])

  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts,
    })
    const { items } = postData.data.listPosts
    const postWithImages = await Promise.all(
      items.map(async post => {
        if (post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage)
        }
        return post
      })
    )

    setPosts(postWithImages)
  }

  return (
    <div>
      <h1 className="mt-6 mb-8 text-3xl font-semibold tracking-wide">Posts</h1>

      {posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="pb-6 my-6 border-b border-gray-300">
            {post.coverImage && (
              <img
                src={post.coverImage}
                className="bg-center bg-contain rounded-full w-36 h-36 sm:mx-0 sm:shrink-0"
              />
            )}
            <div className="mt-2 cursor-pointer">
              <h2 className="text-xl font-semibold" key={index}>
                {post.title}
              </h2>
              <p className="mt-2 text-gray-500">Author: {post.username}</p>
              {post.comments.items.length > 0 &&
                post.comments.items.map((comment, index) => (
                  <div
                    key={index}
                    className="max-w-xl px-8 py-8 mx-12 mx-auto my-6 mb-2 space-y-2 bg-white shadow-lg rounded-xl sm:py-1 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"
                  >
                    <div>
                      <p className="mt-2 text-gray-500">{comment.message}</p>
                      <p className="mt-1 text-gray-200">{comment.createdBy}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
