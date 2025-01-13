'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ArrowLeftCircleIcon } from "lucide-react";

export default function Signup() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value
    };
    try {
      const response = await fetch('https://pdfstoragefunctionapp.azurewebsites.net/api/Signup?code=3Qu9ojpaiqOI7a3ASW2joJSRCliRw_U2YblWljFl3Ns5AzFujvUjlg%3D%3D', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('There was a problem with the form submission:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <ArrowLeftCircleIcon 
            className="text-2xl text-black hover:text-blue-800 transition-all duration-200 ease-in-out"
          />
        </Link>
      </div>

      <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-full max-w-[350px] space-y-6">
            {/* Title Section */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-muted-foreground text-sm">
                Enter your information to create an account
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2 mt-4">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="firstName" placeholder="Max" required />
                  </div>
                  <div className="grid gap-2 mt-4">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="lastName" placeholder="Robinson" required />
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Create an account
                </Button>
              </form>
            </div>

            {/* Sign In Link Section */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Background Image for large screens */}
        <div className="hidden lg:block w-full lg:w-[60vw] h-screen">
          <Image
            src="/bg.jpg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
}
