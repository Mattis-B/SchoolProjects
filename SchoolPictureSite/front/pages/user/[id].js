import React from 'react';
import Head from 'next/head'
import Router from 'next/router'

import API from 'api'

export default class UserPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {editing: false}
    this.nameRef = React.createRef()
    this.typeRef = React.createRef()
  }

  componentDidMount(){
    API.getUser(Router.query.id).then(user=>this.setState({user}))

  }

  modify(){
    if(API.currentUser.type !== "dev") return;
    if(this.state.editing){
    console.log(this.nameRef.current.value)
      API.editUser(Router.query.id, {
        name: this.nameRef.current.value,
        type: this.typeRef.current.value
      }).then(r=>{
        this.setState({editing:false})
      })
    } else {
      this.setState({editing:true})
    }
  }

  render(){
    var user = this.state.user;
    //console.log("USURNIS", user)
    return (
      <>
        <Head>
          <title>{user !== undefined ? (user?.name ?? "User not found") : " "}</title>
        </Head>
        {
          // Cehck if user has been loaded and exists
          Object.entries(user ?? {loading: true}).length > 0 ? (
            <center>
              <h2>{this.state.editing ? (<input type="text" ref={this.nameRef} value={this.state.user?.name} onChange={e=>{user.name = e.target.value; this.setState({user})}} />) : (this.state.user?.name)}</h2>
              <h3>{this.state.editing ? (
                <select ref={this.typeRef}>
                  <option value="dev">dev</option>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              ) : (
                this.state.user?.type
              )}</h3>
              {
                API.currentUser?.type === "dev" ?
                   (
                    <>
                      <h4 onClick={this.modify.bind(this)}>Edit</h4>
                    </>
                  ) : undefined
              }
            </center>
          ) : (
            <center>User not found</center>
          )
        }
      </>
    )
  }
}
