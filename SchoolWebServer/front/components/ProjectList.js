import React from 'react';
import styles from 'styles/ProjectList.module.sass'
import Link from 'next/link'

class ProjectList extends React.Component {
  constructor(props){
    super(props)

    this.projects = [
      {name:"JSRand", link:"/projects/JSRand"},
      {name: "Search engine", link:"/projects/SearchEngine"}
    ];
  }
  render(){
    return(
      <div className={styles.ProjectList}>
        <ul>
          {
            this.projects.map((project) =>
              Array.isArray(project.subProjects) ?
              (
                <Link href={project.link} prefetch="true">
                  <a className={styles.extProject}><li>{project.name}</li></a>
                </Link>
              )
              :
              (
                <Link href={project.link} prefetch="true">
                  <a className={styles.project}><li>{project.name}</li></a>
                </Link>
              )
            )
          }
        </ul>
      </div>
    )
  }


}

export default ProjectList
