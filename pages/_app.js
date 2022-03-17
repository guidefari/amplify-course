import "../styles/globals.css"
import "../configureAmplify"
import Nav from "../components/Nav"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
