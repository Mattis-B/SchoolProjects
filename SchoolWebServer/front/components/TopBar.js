import React from 'react'
import Link from 'next/link'
import styles from 'styles/TopBar.module.sass'

class TopBar extends React.Component {
  render(){
    return (
      <nav className={styles.navBar} prefetch="true">
        <ul>
          <Link href="/">
            <a>
              <li>Home</li>
            </a>
          </Link>
          <Link href="/projects">
            <a>
              <li>JSRand</li>
            </a>
          </Link>
        </ul>
      </nav>
    )
  }
}

export default TopBar
