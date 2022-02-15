import React from 'react';
import styles from 'styles/SideBar.module.sass'
import Link from 'next/link'
import ProjectList from 'components/ProjectList'

class SideBar extends React.Component {
  render(){
    return (
      <div className={styles.SideBar}>
        <div class={styles.entry}>
          <h3 title="Projects I've made in school" class={styles.title}>School projects</h3>
          <ProjectList />
        </div>
      </div>
    )
  }
}

export default SideBar
