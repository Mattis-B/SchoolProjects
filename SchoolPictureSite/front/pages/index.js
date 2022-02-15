import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.css'

import Context from 'context'

export default class Home extends React.Component {
  render(){
    return (
      <>
        <Head>
          <title>School Project(TO BE RENAMED)</title>
          <meta name="description" content="School project" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <center>
          <h2>Welcome</h2>
          <p>This is a website I{"\'"}m making for a schoolproject which has a database and allows users to login</p>
        </center>
      </>
    )
  }
}
