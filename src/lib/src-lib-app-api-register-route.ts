import { hash } from 'bcrypt'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const hashedPassword = await hash(password, 10)
    
    // Use the 'user' variable or remove it if not needed
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    
    return new Response('OK')
  } catch (error) {
    return new Response('Error', { status: 500 })
  }
}