'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { apiClient, AUTH_ENDPOINTS } from '@/lib/api';
import { RegisterFormData, CertificateType } from '@/lib/types';

const CERTIFICATE_OPTIONS = [
  { value: 'SUDANESE', label: 'Sudanese' },
  { value: 'ARABIAN', label: 'Arabian' },
  { value: 'FOREIGN', label: 'Foreign' },
];

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullNameAr: '',
    fullNameEn: '',
    dateOfBirth: '',
    phone: '',
    personalEmail: '',
    address: '',
    certificateType: 'SUDANESE',
    nationality: '',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        setFieldErrors((prev) => ({
          ...prev,
          photo: 'Only image files are allowed (jpg, jpeg, png)',
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFieldErrors((prev) => ({
          ...prev,
          photo: 'File size must be less than 2MB',
        }));
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setFieldErrors((prev) => ({ ...prev, photo: '' }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    if (!photoFile) {
      setFieldErrors((prev) => ({
        ...prev,
        photo: 'Student photo is required',
      }));
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullNameAr', formData.fullNameAr);
      formDataToSend.append('fullNameEn', formData.fullNameEn);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('personalEmail', formData.personalEmail);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('certificateType', formData.certificateType);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('photo', photoFile);

      const response = await apiClient.post(
        AUTH_ENDPOINTS.REGISTER,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setSuccess(
        response.data.message || 'Registration submitted successfully!',
      );
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Student Registration
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
          Fill in your details to create an account
        </p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name (Arabic)"
              name="fullNameAr"
              value={formData.fullNameAr}
              onChange={handleChange}
              placeholder="الاسم الكامل"
              required
              error={fieldErrors.fullNameAr}
              dir="rtl"
            />

            <Input
              label="Full Name (English)"
              name="fullNameEn"
              value={formData.fullNameEn}
              onChange={handleChange}
              placeholder="Ahmed Mohammed"
              required
              error={fieldErrors.fullNameEn}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              error={fieldErrors.dateOfBirth}
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+249912345678"
              required
              error={fieldErrors.phone}
            />
          </div>

          <Input
            label="Personal Email"
            name="personalEmail"
            type="email"
            value={formData.personalEmail}
            onChange={handleChange}
            placeholder="student@example.com"
            required
            error={fieldErrors.personalEmail}
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Khartoum, Sudan"
            required
            error={fieldErrors.address}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Certificate Type"
              name="certificateType"
              value={formData.certificateType}
              onChange={handleChange}
              options={CERTIFICATE_OPTIONS}
              required
              error={fieldErrors.certificateType}
            />

            <Input
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Sudanese"
              required
              error={fieldErrors.nationality}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Photo <span className="text-red-500">*</span>
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                fieldErrors.photo
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
              }`}
            >
              <div className="space-y-1 text-center">
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-8m32-12V8m16 8l-8-8-8 8"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label
                        htmlFor="photo"
                        className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          ref={fileInputRef}
                          id="photo"
                          name="photo"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 2MB</p>
                  </>
                )}
              </div>
            </div>
            {fieldErrors.photo && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.photo}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading || !!success}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </CardBody>

<CardFooter>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400"
          >
            Login here
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
