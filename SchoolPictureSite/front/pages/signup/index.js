import React from 'react'
import styles from 'styles/Login.module.sass'

import API from 'api'

export default class Signup extends React.Component {
  constructor(props){
    super(props)
    this.state = {resp: undefined};
  }

  componentDidMount(){

  }

  render(){
    const {resp} = this.state;
    return (
      <div className={styles["login-form"]}>
        <form onSubmit={this.login.bind(this)} method="post">
        {this.renderMsg()}
          <div className={styles.loginInput}>
            <input type="text" name="name" placeholder="Name" />
          </div>
          <div className={styles.loginInput}>
            <input type="password" name="password" placeholder="Password" />
          </div>
          <input type="submit" value="Signup"/>
        </form>
      </div>
    )
  }
  login(evt){
    evt.preventDefault()

    API.Post("signup", {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: evt.target.name.value,
        password: evt.target.password.value
      })
    }).then(r=>{console.log(r);return r.json()}).then(resp=>{
      this.setState({resp});
      if(resp.type === "SIGNUP"){
        window.location.pathname = "/"
      }
    })
    
    return false;
  }
  renderMsg(){
    const {resp} = this.state;
    if(typeof(resp) !== "object") return;
    return (
      resp.type === "SIGNUP" ? (
        <p>Signed up as {resp.user.name}</p>
      ) : (
        <p>{resp.msg}</p>
      )
    )
  }
}
