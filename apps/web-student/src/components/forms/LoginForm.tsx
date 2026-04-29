"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { apiClient, AUTH_ENDPOINTS } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoginFormData } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, formData);
      login(response.data);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.message.includes("pending admin approval")) {
        setError(
          "Your account is pending admin approval. Please wait for confirmation.",
        );
      } else {
        setError(err.message || "Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Student Login
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
          Enter your credentials to access your account
        </p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@example.com"
            required
            error={fieldErrors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={fieldErrors.password}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardBody>

      <CardFooter>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400"
          >
            Register here
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
