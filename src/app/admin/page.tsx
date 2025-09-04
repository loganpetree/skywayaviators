import { LoginModal } from "@/components/LoginModal";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Skyway Aviators Admin
          </h1>
          <p className="text-gray-600 mb-8">
            Access the administrative panel
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please log in to access the admin dashboard
            </p>

            <LoginModal>
              <Button className="w-full">
                Login to Admin Panel
              </Button>
            </LoginModal>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}
