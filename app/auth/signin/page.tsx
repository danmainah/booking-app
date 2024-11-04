'use client';

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function SignInPage() {
    const router = useSearchParams();
    const [error, setError] = useState("");
  

    useEffect(() => {
        // Capture error from query string if it exists
        const errorParam = router.get("error");
        console.log(error)
        if (errorParam) {
            switch (errorParam) {
                case "CredentialsSignin":
                    setError("Invalid credentials. Please check your email and password.");
                    break;
                case "No user found with email":
                    setError("No user found with this email. Please sign up.");
                    break;
                default:
                    setError("An unexpected error occurred. Please try again.");
            }
        }
    }, [error, router]); 

    const handleSignIn = (provider: string) => signIn(provider, { callbackUrl: "/" })
    .then((result) => {
        if(result?.status === 401) {
            setError(result.error?? "")
            return
        }else {
            setError("")
        }
    }).catch((error) => {
    
        console.log(error)
        setError(error.message)
    });
    return (
        <div className="w-96 md:w-72 lg:w-48 mx-auto align-center">
            <h1 className="text-2xl font-bold">Sign in</h1>
            {error && <div className="text-red-500">{error}</div>}
            <button onClick={() => handleSignIn('google')} className="text-blue-500 m-3">Sign in with Google</button>
            <form onSubmit={(e) => {
                e.preventDefault();
               const form = e.target as HTMLFormElement;
               const email = (form.elements.namedItem('email') as HTMLInputElement).value;
               const password = (form.elements.namedItem('password') as HTMLInputElement).value;
               signIn('credentials', {email, password}).
               then((result) => {
                if(result?.status === 401) {
                    setError(result.error?? "")
                    return
                }else {
                    setError("")
                }
               }).catch((error) => {
                setError(error.message)
               });
           }} className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" autoComplete="on"/>
                <button type="submit">Sign in</button>
            </form>
        </div>
    ) 
}
