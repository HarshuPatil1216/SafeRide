export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-navy-950">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white bg-[radial-gradient(circle_at_20%_20%,#1D4066_0%,#0A1628_60%)]">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-signal-500 flex items-center justify-center font-display font-bold text-navy-950">S</div>
          <span className="font-display font-semibold text-xl">SafeRide</span>
        </div>
        <div className="max-w-md">
          <p className="text-signal-400 font-mono text-xs uppercase tracking-widest mb-3">Every stop, accounted for</p>
          <h2 className="font-display text-4xl font-semibold leading-tight mb-4">
            The route from home to school, watched at every stop.
          </h2>
          <p className="text-navy-300 text-sm leading-relaxed">
            Live vehicle tracking, verified pickups and drop-offs, and instant alerts —
            built for school transport administrators, drivers, and parents.
          </p>
        </div>
        <p className="text-navy-400 text-xs">© {new Date().getFullYear()} SafeRide</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-paper">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="h-8 w-8 rounded-lg bg-signal-500 flex items-center justify-center font-display font-bold text-navy-950">S</div>
            <span className="font-display font-semibold text-lg text-navy-900">SafeRide</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">{title}</h1>
          {subtitle && <p className="text-sm text-navy-600 mt-1 mb-6">{subtitle}</p>}
          {!subtitle && <div className="mb-6" />}
          {children}
        </div>
      </div>
    </div>
  );
}
