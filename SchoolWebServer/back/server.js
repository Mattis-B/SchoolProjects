const fetch = require('node-fetch');

const express = require("express")
const app = express()

app.use(require('cors')({
  origin: [/\.?ghosty\.dev$/, /\.?mattisb\.dev$/]
}))

app.get("/search/:searchquery", (req,res)=>{
  let apiSearchURL = new URL("https://www.googleapis.com/customsearch/v1");
  apiSearchURL.searchParams.append("q",req.params.searchquery)
  apiSearchURL.searchParams.append("key", process.env.gAPIKey)
  apiSearchURL.searchParams.append("cx", process.env.gAPICX)
  fetch(apiSearchURL, {
    method: "GET"
  }).then(r=>r.json()).then(r=>{
    res.json({
      searchInfo: r.searchInformation,
      results: r.items.map(result=>{return {
        link: result.link,
        dLink: result.displayLink,
        url: result.formattedUrl,
        dUrl: result.htmlFormattedUrl,
        htmlSnip: result.htmlSnippet,
        snip: result.snippet,
        title: result.title,
        htmlTitle: result.htmlTitle,
        pMap: result.pagemap
      };})
    })
  });
})

app.listen(3001)
