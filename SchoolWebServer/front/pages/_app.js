import 'styles/globals.sass'

import TopBar from 'components/TopBar'
import SideBar from 'components/SideBar'

function App({ Component, pageProps }) {
  return (
    <>
      <TopBar />
      <SideBar />
      <div style={{height: "33px"}}></div>
      <Component {...pageProps} />
    </>
  )
}

export default App
