import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Aircraft not found</h2>
        <p className="text-gray-500 text-sm mb-8">The aircraft you are looking for does not exist.</p>
        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="px-6"
        >
          Back to home
        </Button>
      </div>
    </div>
  )
}
