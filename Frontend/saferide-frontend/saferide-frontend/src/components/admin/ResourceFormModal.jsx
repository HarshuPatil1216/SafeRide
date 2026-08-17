import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { Field, Input, Select, Checkbox } from "../ui/FormControls";

/**
 * fields: [{ name, label, type: 'text'|'email'|'number'|'select'|'checkbox'|'textarea',
 *            required, options: [{value,label}], placeholder, hint, step }]
 */
export default function ResourceFormModal({ open, title, fields, initialValues, onClose, onSubmit, submitting }) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(initialValues || {});
      setErrors({});
    }
  }, [open, initialValues]);

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    fields.forEach((f) => {
      if (f.required && (values[f.name] === undefined || values[f.name] === null || values[f.name] === "")) {
        next[f.name] = `${f.label} is required`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(values);
    } catch (err) {
      if (err.fieldErrors) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      } else {
        setErrors((prev) => ({ ...prev, __form: err.message }));
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.__form && (
          <div className="rounded-lg border border-transit-stop/25 bg-transit-stop/5 px-3 py-2.5 text-sm text-transit-stop">
            {errors.__form}
          </div>
        )}

        {fields.map((f) => {
          if (f.type === "checkbox") {
            return (
              <Checkbox
                key={f.name}
                label={f.label}
                checked={Boolean(values[f.name])}
                onChange={(e) => setField(f.name, e.target.checked)}
              />
            );
          }

          if (f.type === "select") {
            return (
              <Field key={f.name} label={f.label} required={f.required} error={errors[f.name]} hint={f.hint}>
                <Select value={values[f.name] ?? ""} onChange={(e) => setField(f.name, e.target.value)}>
                  <option value="" disabled>
                    {f.placeholder || `Select ${f.label.toLowerCase()}`}
                  </option>
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Field>
            );
          }

          return (
            <Field key={f.name} label={f.label} required={f.required} error={errors[f.name]} hint={f.hint}>
              <Input
                type={f.type || "text"}
                step={f.step}
                value={values[f.name] ?? ""}
                error={errors[f.name]}
                placeholder={f.placeholder}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            </Field>
          );
        })}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
