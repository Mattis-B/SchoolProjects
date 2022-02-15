import '../styles/globals.sass'
import React from 'react'

import TopBar from 'components/TopBar'

import API from 'api'

export default class MyApp extends React.Component {
  constructor({ Component, pageProps }) {
    super({Component, pageProps})
    this.state = {user:undefined}

  }

  componentDidMount(){
    // fetch(process.env.API + "/user", {
    //   credentials: 'include',
    //   mode: "cors",
    //   method:"GET"
    // }).then(r=>r.json()).then(user=>{
    //   if(user.err !== "NO_AUTH")
    //     this.setState({user})
    // })
    API.init().then(apiInit=>{
      this.setState({user: API.currentUser})
    })
  }
  render(){

    return API.currentUser === undefined ? (
      <>
        <TopBar />
        <center>
          <h2>Loading</h2>
        </center>
        <div className="background"></div>
      </>
    ) : (
      <>
        <TopBar />
        <this.props.Component {...this.props.pageProps} />
        <div className="background"></div>
      </>
    )
  }
}
