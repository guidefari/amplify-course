import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react/legacy"
import { Auth } from "aws-amplify"
import { useState, useEffect } from "react"

function Profile() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    if (user) setUser(user)
  }
  if (!user) return null
  return (
    <div>
      <h1 className="mt-6 text-3xl font-semibold tracking-wide">Profile</h1>
      <h1 className="my-2 font-medium text-gray-500">
        Username: {user.username}
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Email: {user.attributes.email}
      </p>
      <AmplifySignOut />
    </div>
  )
}
export default withAuthenticator(Profile)
