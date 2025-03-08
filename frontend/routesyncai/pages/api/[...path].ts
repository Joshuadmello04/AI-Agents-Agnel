import type { NextApiRequest, NextApiResponse } from "next"
import httpProxyMiddleware from "next-http-proxy-middleware"

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return httpProxyMiddleware(req, res, {
    target: "http://127.0.0.1:8000",
    pathRewrite: [
      {
        patternStr: "^/api",
        replaceStr: "",
      },
    ],
    changeOrigin: true,
  })
}

