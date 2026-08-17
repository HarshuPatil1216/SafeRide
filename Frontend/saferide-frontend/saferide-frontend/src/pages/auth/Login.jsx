import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { Field, Input } from "../../components/ui/FormControls";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { homeForRole } from "../../utils/constants";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login(form.email.trim(), form.password);
      toast.success("Welcome back!");
      const redirectTo = location.state?.from?.pathname || homeForRole(user.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message || "Couldn't sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Access your SafeRide dashboard">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div className="rounded-lg border border-transit-stop/25 bg-transit-stop/5 px-3 py-2.5 text-sm text-transit-stop">
            {formError}
          </div>
        )}

        <Field label="Email" error={errors.email} required>
          <Input
            type="email"
            autoComplete="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@saferide.com"
          />
        </Field>

        <Field label="Password" error={errors.password} required>
          <Input
            type="password"
            autoComplete="current-password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-navy-600 mt-6 text-center">
        New to SafeRide?{" "}
        <Link to="/register" className="font-semibold text-navy-900 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
