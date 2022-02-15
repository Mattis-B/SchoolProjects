import React from 'react'

export default class Test extends React.Component {
  constructor(props){
    super(props);
    this.canvasRef = React.createRef();
  }

  f(x,y){
    return [Math.sin(x), Math.cos(y)]
  }

  componentDidMount(){
    let ctx = this.canvasRef.current.getContext("2d")
    for (let x = 0; x < this.canvasRef.current.width; ++x){
      for (let y = 0; y < this.canvasRef.current.height; ++y){
        let p = this.f(Math.random()*this.canvasRef.current.width,Math.random()*this.canvasRef.current.height)
        ctx.strokeStyle = ctx.fillStyle = "rgb("+p[0]*255+","+p[1]*255+","+0+")"
        ctx.fillRect(x,y,1,1)
      }
    }
  }

  tick(){

  }

  componentWillUnmount(){
    //clearInterval(this.t)
  }

  render(){
    return (
      <div>
        <canvas ref={this.canvasRef} width="600" height="400" />
      </div>
    )
  }
}
