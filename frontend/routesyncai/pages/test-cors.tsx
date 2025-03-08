"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function TestCors() {
  const [corsStatus, setCorsStatus] = useState<string>("Testing CORS...")
  const [proxyStatus, setProxyStatus] = useState<string>("Testing proxy...")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test direct CORS
    const testDirectCors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/test-cors")
        setCorsStatus(`Direct CORS Test Successful: ${JSON.stringify(response.data)}`)
      } catch (e) {
        setCorsStatus(`Direct CORS Test Failed: ${e instanceof Error ? e.message : "Unknown error"}`)
      }
    }

    // Test proxy
    const testProxy = async () => {
      try {
        const response = await axios.get("/api/proxy/test-cors")
        setProxyStatus(`Proxy Test Successful: ${JSON.stringify(response.data)}`)
      } catch (e) {
        setProxyStatus(`Proxy Test Failed: ${e instanceof Error ? e.message : "Unknown error"}`)
      }
    }

    testDirectCors()
    testProxy()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CORS Test Page</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Direct CORS Status:</h2>
        <pre className="whitespace-pre-wrap">{corsStatus}</pre>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Proxy Status:</h2>
        <pre className="whitespace-pre-wrap">{proxyStatus}</pre>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          <h2 className="font-semibold mb-2">Error:</h2>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Debugging Tips:</h2>
        <ul className="list-disc pl-5">
          <li>Make sure your FastAPI server is running on port 8000</li>
          <li>Check the browser console for detailed error messages</li>
          <li>If direct CORS fails but proxy works, use the proxy approach</li>
          <li>Verify that CORS is properly configured in your FastAPI app</li>
        </ul>
      </div>
    </div>
  )
}

