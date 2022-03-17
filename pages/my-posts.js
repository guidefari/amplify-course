import { Auth, API, Storage } from "aws-amplify"
import Link from "next/link"
import { useEffect, useState } from "react"
import { postsByUsername } from "../src/graphql/queries"
import Moment from "moment"
import { deletePost as deletePostMutation } from "../src/graphql/mutations"

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser()
    const postData = await API.graphql({
      query: postsByUsername,
      variables: { username },
    })

    //to get image thumbnails
    const { items } = postData.data.postsByUsername

    //Fetch images from S3 for posts that contain a cover image
    const postsWithImages = await Promise.all(
      items.map(async post => {
        if (post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage)
        }
        return post
      })
    )
    setPosts(postsWithImages)
    //setPosts(postData.data.postsByUsername.items);
  }
  async function deletePost(id) {
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    })
    fetchPosts()
  }

  return (
    <div>
      {posts.map((post, index) => (
        <div
          key={index}
          className="px-8 py-8 mx-auto mb-2 space-y-2 bg-white shadow-lg max-w-xxl rounded-xl sm:py-1 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"
        >
          {post.coverImage && (
            <img
              className="bg-center bg-contain rounded-full w-36 h-36 sm:mx-0 sm:shrink-0"
              src={post.coverImage}
            />
          )}
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5">
              <p className="text-lg font-semibold text-black">{post.title}</p>
              <p className="font-medium text-slate-500">
                Created on: {Moment(post.createdAt).format("ddd, MMM hh:mm a")}
              </p>
            </div>
            <div
              className="sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1"
            >
              <p
                className="px-4 py-1 text-sm font-semibold text-purple-600 border border-purple-200 rounded-full hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <Link href={`/edit-post/${post.id}`}>Edit Post</Link>
              </p>

              <p
                className="px-4 py-1 text-sm font-semibold text-purple-600 border border-purple-200 rounded-full hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <Link href={`/posts/${post.id}`}>View Post</Link>
              </p>

              <button
                className="mr-4 text-sm text-red-500"
                onClick={() => deletePost(post.id)}
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
