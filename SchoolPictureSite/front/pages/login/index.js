import React from 'react'
import styles from 'styles/Login.module.sass'

import API from 'api'

export default class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {resp: undefined, signup: false};
  }

  componentDidMount(){

  }

  switchSignupLogin(evt){
    this.setState({signup: !this.state.signup})
  }

  render(){
    const {resp} = this.state;
    return (
      <div className={styles["page-login"]}>
        <div className={styles["login-form"]}>
          <div className={styles["login-header"]}>
            <input type="button" onClick={this.switchSignupLogin.bind(this)} value={this.state.signup ? "Signup" : "Login"} />
          </div>
          <div className={[styles["login-signup-form"]]}>
            <form style={{
              opacity: 0,
              position: "relative",
              padding: "1.3em 1em .7em 1em",
              borderRadius: "10px"
            }}>
            {this.renderMsg()}
            <div className={styles.loginInput}>
              <div className={styles.inputHeader}>Username</div>
              <div className={styles.inputData}>
                <input type="text" name="username" placeholder="Username" />
              </div>
            </div>
            <div className={styles.loginInput}>
              <div className={styles.inputHeader}>Password</div>
              <div className={styles.inputData}>
                <input type="password" name="password" placeholder="Password" />
              </div>
            </div>
            <input type="submit" value="Dummy"/>
            </form>
            <div style={{position: "absolute"}}>
              <form className={styles["login"] + " " + styles[(this.state.signup ? "hidden" : "visible")]} onSubmit={this.login.bind(this)} method="post">
              {this.renderMsg()}
                <div className={styles.loginInput}>
                  <div className={styles.inputHeader}>Username</div>
                  <div className={styles.inputData}>
                    <input type="text" name="username" placeholder="Username" />
                  </div>
                </div>
                <div className={styles.loginInput}>
                  <div className={styles.inputHeader}>Password</div>
                  <div className={styles.inputData}>
                    <input type="password" name="password" placeholder="Password" />
                  </div>
                </div>
                <input type="submit" value="Login"/>
              </form>
              <form className={styles["signup"] + " " + styles[(this.state.signup ? "visible" : "hidden")]} onSubmit={this.signup.bind(this)} method="post">
              {this.renderMsg()}
              <div className={styles.loginInput}>
                <div className={styles.inputHeader}>Username</div>
                <div className={styles.inputData}>
                  <input type="text" name="username" placeholder="Username" />
                </div>
              </div>
              <div className={styles.loginInput}>
                <div className={styles.inputHeader}>Password</div>
                <div className={styles.inputData}>
                  <input type="password" name="password" placeholder="Password" />
                </div>
              </div>
              <input type="submit" value="Signup"/>
            </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  signup(evt){
    evt.preventDefault()
    API.Post("signup", {
      username: evt.target.username.value,
      password: evt.target.password.value
    }).then(r=>r.json()).then(resp=>{
      this.setState({resp})
      if(resp.type === "SIGNUP") {
        window.location.pathname = "/"
      }
    })
    return false;
  }
  login(evt){
    evt.preventDefault()

    API.Post("login", {
      username: evt.target.username.value,
      password: evt.target.password.value
    }).then(r=>{console.log(r);return r.json()}).then(resp=>{
      this.setState({resp});
      if(resp.type === "LOGIN"){
        window.location.pathname = "/"
      }
    })
    return false;
  }
  renderMsg(){
    const {resp} = this.state;
    if(typeof(resp) !== "object") return;
    return (
      resp.type === "LOGIN" ? (
        <p>Logged in as {resp.user.name}</p>
      ) : (
        <p>{resp.msg}</p>
      )
    )
  }
}
