const StepIndicator = ({ step, total, label }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => {
                const index = i + 1
                const active = index <= step
                return (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition ${
                            active ? "bg-emerald-500" : "bg-slate-800"
                        }`}
                    />
                )
            })}
        </div>
        <p className="mt-2 text-xs text-slate-500">
            Step {step} of {total} · {label}
        </p>
    </div>
)

export default StepIndicator