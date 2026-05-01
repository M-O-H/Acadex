'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { user, isLoading, isAuth, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      router.push('/login');
    }
  }, [isLoading, isAuth, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-primary-600">Acadex</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-gray-700 dark:text-gray-300">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome!
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                <p className="text-primary-800 dark:text-primary-200">
                  Your account is active. You can now enroll in courses and
                  access your academic records.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
