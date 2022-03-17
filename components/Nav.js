import Link from "next/link"
import React, { useEffect, useState } from "react"
import "../configureAmplify"
import { Auth, Hub } from "aws-amplify"

const Nav = () => {
  const [signedUser, setSignedUser] = useState(false)

  useEffect(() => {
    authListener()
  }, [])

  async function authListener() {
    Hub.listen("auth", data => {
      switch (data.payload.event) {
        case "signIn":
          return setSignedUser(true)
        case "signOut":
          return setSignedUser(false)
      }
    })
    try {
      await Auth.currentAuthenticatedUser()
      setSignedUser(true)
    } catch (err) {}
  }

  return (
    <nav className="flex justify-center pt-3 pb-3 space-x-4 border-b border-gray-300 bg-cyan-500">
      {[
        ["Home", "/"],
        ["Create Post", "/create-post"],
        ["Profile", "/profile"],
      ].map(([title, url], index) => (
        <Link href={url} key={index}>
          <a className="px-3 py-2 font-medium rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            {" "}
            {title}
          </a>
        </Link>
      ))}

      {signedUser && (
        <Link href="/my-posts">
          <a className="px-3 py-2 font-medium rounded-lg text-slate-700 hover:bg-slage-100 hover:text-slate-900">
            My Post
          </a>
        </Link>
      )}
    </nav>
  )
}

export default Nav
