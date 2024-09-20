import rateLimit from 'express-rate-limit'
import { NextApiResponse } from 'next'

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  handler: (_, res: NextApiResponse) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' })
  },
})

export default rateLimiter