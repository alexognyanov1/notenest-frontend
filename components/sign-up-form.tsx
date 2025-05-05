import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import api, { LOCAL_STORAGE_KEY } from "@/api";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const res = await api.post("auth/register", {
      firstName,
      lastName,
      email,
      password,
    });

    if (res.status === 200 || res.status === 201) {
      console.log("Registration successful");
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));

      window.location.href = "/";
    } else {
      console.error("Registration failed");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Fill in the details below to sign up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Log in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
