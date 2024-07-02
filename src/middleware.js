import { withAuth } from "next-auth/middleware"
import { jwtDecode } from "jwt-decode"

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (!token) return false
      const decodedJwt = jwtDecode(token)
      //check if decodedJwt is not expired
      const currentTime = new Date().getTime() / 1000
      if (currentTime > decodedJwt.exp) return false
      return !!token || decodedJwt?.role === "owner"
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    decode: ({ secret, token }) => {
      return token
    },
  },
})

export const config = {
  matcher: ["/xhh", "/campaign", "/install"],
}
