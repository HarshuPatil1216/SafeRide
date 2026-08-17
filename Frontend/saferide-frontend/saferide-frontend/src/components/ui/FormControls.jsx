export function Field({ label, error, required, children, hint }) {
  return (
    <div>
      {label && (
        <label className="label">
          {label} {required && <span className="text-transit-stop">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-navy-500 mt-1">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function Input({ error, className = "", ...props }) {
  return <input className={`input ${error ? "border-transit-stop focus:ring-transit-stop/20" : ""} ${className}`} {...props} />;
}

export function Select({ error, className = "", children, ...props }) {
  return (
    <select className={`input ${error ? "border-transit-stop" : ""} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ error, className = "", ...props }) {
  return <textarea className={`input min-h-[90px] resize-y ${error ? "border-transit-stop" : ""} ${className}`} {...props} />;
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy-800 font-medium">
      <input type="checkbox" className="h-4 w-4 rounded border-navy-900/25 text-navy-800 focus:ring-navy-700" {...props} />
      {label}
    </label>
  );
}
