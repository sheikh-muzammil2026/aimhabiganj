import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    sessionOptions: {
        refetchOnWindowFocus: true,
        refetchWhenOffline: false,
    },
})

export const { signIn, signUp, useSession } = authClient

