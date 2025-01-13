"use client"
import React, {useState} from 'react'

const page = () => {
    const [count,setCounT]=useState('')
  return (
    <div>
      <h1 className=''>Hello</h1>
      <h1>Calculater</h1>
      <div onClick={()=>setCounT(count+1)}>+</div>
      <div>{count}</div>
      <div onClick={()=>setCounT(count-1)}>-</div>
    </div>
  )
}

export default page
