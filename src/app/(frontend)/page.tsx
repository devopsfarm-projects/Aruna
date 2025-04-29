import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="content flex-grow text-center">
        <div className="p-8">
          <picture>
            <Image
              alt="Payload Logo"
              height={205}
              src="/image.png"
              width={205}
              className="mx-auto mb-4"
            />
          </picture>
          {!user && <h1 className="text-2xl font-bold text-gray-800">Welcome to your new project.</h1>}
          {user && <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.email}</h1>}
          <div className="mt-8 flex justify-center space-x-4">
            <a
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition duration-200"
              href={payloadConfig.routes.admin}
              rel="noopener noreferrer"
              target="_blank"
            >
              Go to admin panel
            </a>
          </div>
        </div>
      </div>
      <div className="footer bg-gray-200 p-4 text-center w-full">
        {/* <p className="text-gray-600">Update this page by editing</p>
        <a className="text-blue-600 hover:underline" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a> */}
      </div>
    </div>
  )
}

