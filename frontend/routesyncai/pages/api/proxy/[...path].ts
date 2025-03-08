import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query

  if (!path || !Array.isArray(path)) {
    return res.status(400).json({ error: "Invalid path" })
  }

  const apiPath = path.join("/")
  const apiUrl = `http://127.0.0.1:8000/${apiPath}`

  try {
    // Forward the request to the FastAPI backend
    const response = await axios({
      method: req.method as string,
      url: apiUrl,
      data: req.method !== "GET" ? req.body : undefined,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Return the response from the FastAPI backend
    res.status(response.status).json(response.data)
  } catch (error) {
    console.error("API proxy error:", error)

    if (axios.isAxiosError(error) && error.response) {
      // Forward the error response from the FastAPI backend
      res.status(error.response.status).json(error.response.data)
    } else {
      // Generic error
      res.status(500).json({ error: "Failed to proxy request to API" })
    }
  }
}

