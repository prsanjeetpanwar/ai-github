"use client"
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { createCheckoutSession } from '@/lib/stripe'
import { api } from '@/trpc/react'
import { Info } from 'lucide-react'
import React, { useState } from 'react'

const page = () => {
  const { data: user } = api.project.getMyCredits.useQuery()
  const [creditToBuy, setCreditToBuy] = useState([100])
  const creditToBuyAmount = creditToBuy[0]
  const price = (creditToBuyAmount / 50).toFixed(2)
  return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold'>Billing</h1>
      <div className='h-2'></div>
      <p className='text-sm text-gray-500'>
        You currently have {user?.credits} credits. You can buy more credits to use the Dinoysus API.
      </p>
      <div className="h2"></div>
      <div className='bg-blue-50 px-4 py-2 rounded-md border border-blue-200 text-blue-700'>
        <div className=' flex items-center gap-2'>
          <Info className='size-4' />
          <p className='text-sm'>Each credits allows you to index 1 file in repositary.</p>

        </div>
        <p className='text-sm'>E.g If your project has 100 files. you will need 100 credits to index it</p>
      </div>
      <div className='h-4'></div>
      <Slider defaultValue={[100]} max={1000} step={10} onValueChange={value=>setCreditToBuy(value)}
        value={creditToBuy}
        />
        <div className='h-4'></div>
         <Button onClick={()=>{
          createCheckoutSession(creditToBuyAmount)
         }}>
          Buy {creditToBuyAmount} credits for ${price}
         </Button>
    </div>
  )
}

export default page
