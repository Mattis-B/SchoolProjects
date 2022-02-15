import React from 'react'
import Link from 'next/link'
import styles from 'styles/TopBar.module.sass'

import API from 'api'

class TopBar extends React.Component {
  render(){
    console.log(API.currentUser)
    return (
      <header className={styles.navBar}>
        <nav prefetch="true">
          <ul>
            <Link href="/">
              <a>
                <li>LOGO/Title</li>
              </a>
            </Link>
          </ul>
          {API.currentUser !== undefined && API.currentUser?.err === undefined ? (
            <Link href={"/user/"+API.currentUser.id}>
              <a className={styles.user}>
                {API.currentUser.name}
              </a>
            </Link>
          ) : (
            <Link href="/login">
              <a className={styles.user}>
                Login
              </a>
            </Link>
          )}
        </nav>
      </header>
    )
  }
}

export default TopBar
