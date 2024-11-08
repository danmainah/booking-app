"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
   const session = useSession();


    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam) {
            setError(errorParam);
        }
    }, [searchParams]);
    const handleSignIn = async (provider: string) => {
        try {
            await signIn(provider, { callbackUrl: "/" });
        } catch (error) {
            setError("An error occurred during sign-in. Please try again.");
        }
    };

    return (
        <div className="w-96 md:w-72 lg:w-48 mx-auto align-center">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <button onClick={() => handleSignIn("google")} className="text-blue-500 m-3">
                Sign in with Google
            </button>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
                    fetch("/api/auth/signin", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          if (data.error) {
                            setError(data.error);
                          } else {
                            redirect("/");
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                          setError("An unknown error occurred.");
                        });
                }}
                className="flex flex-col gap-2"
            >
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" autoComplete="on" required />
                <button type="submit">Sign in</button>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            <Link href="/auth/signup" className="text-blue-500">Sign up</Link>
        </div>
    );
}
