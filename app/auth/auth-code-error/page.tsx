import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Authentication Error
          </h1>
          <p className="text-gray-600">
            We couldn't complete your authentication request.
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-red-900">What happened?</h2>
          <p className="text-sm text-red-700">
            The authentication code was invalid or has expired. This can happen if:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
            <li>The link has already been used</li>
            <li>The link has expired</li>
            <li>There was an error in the authentication process</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/sign-in"
            className="block w-full rounded-lg bg-purple-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-purple-700"
          >
            Try Signing In Again
          </Link>
          <Link
            href="/sign-up"
            className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            Create New Account
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-sm text-gray-600 hover:text-gray-900"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-1 font-semibold text-blue-900">Need help?</h3>
          <p className="text-sm text-blue-700">
            If you continue to experience issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}
