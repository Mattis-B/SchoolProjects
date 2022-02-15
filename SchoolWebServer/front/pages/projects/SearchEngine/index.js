import React from 'react'
import styles from './SearchEngine.module.sass'
import Head from 'next/head'
import Image from 'next/image'

class SearchResult extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <a href={this.props.result.link}>
        <div class={styles.searchResult}>
          <img class={styles.searchImage} src={Array.isArray(this.props.result?.pMap?.cse_thumbnail) ? this.props.result.pMap.cse_thumbnail[0].src : undefined} />
          <div class={styles.searchContent}>
            <h3 dangerouslySetInnerHTML={{__html: this.props.result.htmlTitle}}></h3>
            <span dangerouslySetInnerHTML={{__html: "<u>"+this.props.result.dUrl+"</u>"}}></span>
            <p dangerouslySetInnerHTML={{__html: this.props.result.htmlSnip}}></p>
          </div>
        </div>
      </a>
    )
  }
}

class SearchEngine extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    return (
      <>
        <Head>
          <title>School search engine</title>
        </Head>
        <div class={[styles.searchArea, this.state.searchResults === undefined ? styles.searchAreaCenter : styles.searchAreaTop].filter(cls=>cls).join(' ')}>
          <div class={[styles.searchBar, this.state.searchResults !== undefined ? styles.searchBarTop : styles.searchBarCenter].join(' ')}>
            <input class={styles.searchBarInput} placeholder="Searchterm" type="search" onKeyDown={this.doSearch.bind(this)} />
            <img src="/SearchIcon.svg" onClick={this.doSiblingSearch.bind(this)} title="Incase you don't want to just press enter" class={styles.searchButton} />
          </div>
        </div>
        {
          this.state.searchResults !== undefined && this.state.searchResults.results.map(r=>(
            <SearchResult result={r} />
          ))
        }
      </>
    )
  }

  doSiblingSearch(evt){
    fetch("https://schoolapi.ghosty.dev/search/"+encodeURI(evt.target.parentElement.querySelector("."+styles.searchBarInput).value), {MODE:"cors"}).then(r=>r.json()).then(r=>this.setState({searchResults: r})).catch(r=>console.error(r));
  }

  doSearch(evt){
    if(evt.code === "Enter"){
      fetch("https://schoolapi.ghosty.dev/search/"+encodeURI(evt.target.value), {MODE:"cors"}).then(r=>r.json()).then(r=>this.setState({searchResults: r})).catch(r=>{window.lastNetError=r;console.error(r)});
    }
  }
}

export default SearchEngine
