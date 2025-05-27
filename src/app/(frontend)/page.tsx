import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { millisecondsToSeconds } from 'framer-motion'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const list = [0,1,0,0,1,1,2,2,1]
  const list2=[]
  for(let i=0;i<list.length;i++){
  if(list[i]==0){
      list2.push(list[i])
  }
  }
  for(let i=0;i<list.length;i++){
      if(list[i]==1){
          list2.push(list[i])
      }
  }
  for(let i=0;i<list.length;i++){
      if(list[i]==2){
          list2.push(list[i])
      }
  }

console.log(list2)
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center p-8">
          <picture>
            <Image
              alt="Payload Logo"
              height={205}
              src="/image.png"
              width={205}
              className="mx-auto mb-4"
            />
          </picture>
          {!user && <h1 className="text-2xl font-bold text-gray-800  dark:text-white">Welcome to your new project.</h1>}
          {user && <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {user.email}</h1>}
          <div className="mt-8 flex justify-center space-x-4">
            <a
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition duration-200"
              href={!user ? '/login' : '/dashboard'}
              rel="noopener noreferrer"
              target={user ? '_blank' : '_self'}
            >
              Go to admin panel
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
  
