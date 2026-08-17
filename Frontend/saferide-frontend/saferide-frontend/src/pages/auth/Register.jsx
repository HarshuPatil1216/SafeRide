import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { Field, Input, Select } from "../../components/ui/FormControls";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "PARENT" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password || form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (!form.role) next.role = "Please choose a role";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(form);
      toast.success("Account created. You can sign in now.");
      navigate("/login", { replace: true });
    } catch (err) {
      if (err.fieldErrors) setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      setFormError(err.message || "Couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Register as an admin, driver, or parent">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div className="rounded-lg border border-transit-stop/25 bg-transit-stop/5 px-3 py-2.5 text-sm text-transit-stop">
            {formError}
          </div>
        )}

        <Field label="Full name" error={errors.fullName} required>
          <Input
            value={form.fullName}
            error={errors.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Jamie Rivera"
          />
        </Field>

        <Field label="Email" error={errors.email} required>
          <Input
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@saferide.com"
          />
        </Field>

        <Field label="Password" error={errors.password} required hint="At least 6 characters">
          <Input
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        <Field label="I am a" error={errors.role} required>
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="ADMIN">Administrator</option>
            <option value="DRIVER">Driver</option>
            <option value="PARENT">Parent</option>
          </Select>
        </Field>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-navy-600 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-navy-900 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
