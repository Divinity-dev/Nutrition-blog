"use client";

import { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authslice";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  userName: Yup.string().trim().min(2, "Name must contain at least 2 characters").required("Your name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage("");
    try {
      const { userName, email, password } = values;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/register`,
        { userName, email, password },
        { withCredentials: true }
      );

      // Registration creates a standard user account. Log in separately to establish
      // the HttpOnly session cookie used by protected API routes.
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(login(response.data));
      router.replace("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <main className="min-h-[75vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-7 shadow-lg sm:p-9">
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">Join NutriBlog</p>
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">Sign up to join the NutriBlog community.</p>
        </div>

        <Formik
          initialValues={{ userName: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="userName" className="mb-1.5 block text-sm font-medium text-gray-700">Full name</label>
                <Field id="userName" name="userName" type="text" autoComplete="name" placeholder="Your name" className={inputClass} />
                <ErrorMessage name="userName" component="p" className="mt-1 text-xs text-red-600" />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
                <Field id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
                <ErrorMessage name="email" component="p" className="mt-1 text-xs text-red-600" />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Field id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" className={`${inputClass} pr-12`} />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-600" />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</label>
                <div className="relative">
                  <Field id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" className={`${inputClass} pr-12`} />
                  <button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-xs text-red-600" />
              </div>

              {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

              <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-orange-700 hover:underline">Log in</Link>
        </p>
      </section>
    </main>
  );
}
