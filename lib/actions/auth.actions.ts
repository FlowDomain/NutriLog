'use server'

import { headers } from "next/headers"
import { auth } from "../auth/auth"


export const signUpWithEmail = async ({ email, fullName,  password, }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName }
        })