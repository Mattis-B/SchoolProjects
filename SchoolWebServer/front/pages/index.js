import React from 'react'
import Head from 'next/head'
import styles from 'styles/Home.module.sass'

import ProjectList from 'components/ProjectList'

class Home extends React.Component {
  render(){
    return (
      <>
      <Head>
        <title>School projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h2>Welcome to my school site</h2>
          <p>This is where I put my school projects</p>
        </main>
      </div>
      </>
    )
  }
}

export default Home
