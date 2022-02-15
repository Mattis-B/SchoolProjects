import {NextRequest, NextResponse} from 'next/server'

export function middleware(req, evt){
  //console.log(req,evt)
  return NextResponse.next()
}
