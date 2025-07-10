import { useRouter } from 'next/navigation'

interface MessageProps {
  setShowMessage: (value: boolean) => void
  path?: string
  type: 'success' | 'error'
  message?: string
}

export function Message({ setShowMessage, path, type, message }: MessageProps) {
  const router = useRouter()

  const statusIcon = type === 'success' ? (
    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const statusText = type === 'success' ? 'Success!' : 'Error!'
  const defaultMessage = type === 'success' ? 'Operation completed successfully.' : 'An error occurred. Please try again.'

  return (
    <div className="fixed inset-0 dark:bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          {statusIcon}
          <h2 className="text-xl font-bold">{statusText}</h2>
        </div>
        <p className="mb-4">{message || defaultMessage}</p>
        <button
          onClick={async () => {
            setShowMessage(false);
            if (type === 'success') {
              await router.push(path || '/');
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  )
}


