export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Loading aircraft details...</p>
      </div>
    </div>
  )
}
