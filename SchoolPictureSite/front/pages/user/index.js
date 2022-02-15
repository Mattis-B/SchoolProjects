import React from 'react';

import Context from 'context'

import API from 'api'

export default class UserPage extends React.Component {
  constructor(props){
    super(props)
    console.log(this.props)
  }

  render(){
    return (
      <>

      </>
    )
  }
}

export async function getServerSideProps({req,res,query,params}){
  console.log("Cookies",req.cookies)
  let user = API.getUser();
  console.log("FF",user)
  return {
    redirect: {
      destination: user.id ?? "/login",
      permanent: false
    }
  }
}
