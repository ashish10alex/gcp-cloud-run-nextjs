import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const verifyUserSignIn = async (email: string, password: string) => {
    try {
        const urlSearchParams = new URLSearchParams({ email: email, password: password })
        const baseUrl = process.env.NEXTAUTH_URL || "https://gcp-cloud-run-nextjs-927945483375.us-central1.run.app"
        const url = `${baseUrl}/api/verify_user_signin?${urlSearchParams.toString()}`
        console.log(`Making request to: ${url}`)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        
        console.log(`Response status: ${response.status}`)
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()))
        
        if (!response.ok) {
            const text = await response.text()
            console.error('Error response body:', text)
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text()
            console.error('Unexpected response body:', text)
            throw new Error(`Expected JSON response but got ${contentType}`)
        }
        
        const data = await response.json()
        console.log('Response data:', data)
        return data
    } catch (error) {
        console.error('verifyUserSignIn error:', error)
        throw error
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { type: "email", label: "Email" },
                password: { type: "password", label: "Password" },
            },

            authorize: async ({ email, password }) => {
                try {
                    // const { isPasswordValid, userEmail } = await verifyUserSignIn(String(email), String(password))
                    //NOTE: For local development, we are bypassing the verification of user credentials
                    const isPasswordValid = true
                    const userEmail = "ashish.alex10@gmail.com"
                    
                    if (!isPasswordValid) {
                        console.error('Invalid credentials')
                        throw new CredentialsSignin({
                            message: "Invalid credentials"
                        })
                    }
                    
                    return {
                        email: userEmail,
                    }
                } catch (error) {
                    console.error('Authorization error:', error)
                    throw new CredentialsSignin({
                        message: error instanceof Error ? error.message : "Authentication failed"
                    })
                }
            }
        })
    ],
    trustHost: true,
    callbacks: {
        redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
    },
})
