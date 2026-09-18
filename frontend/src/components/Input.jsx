const Input = ({ id, label, error, className = "", ...props }) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-slate-300 mb-1.5"
            >
                {label}
            </label>

            <input
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full rounded-lg bg-slate-950 px-3.5 py-2.5 text-slate-100
                    placeholder-slate-500 border transition
                    focus:outline-none focus:ring-2
                    ${
                        error
                            ? "border-rose-500/60 focus:ring-rose-500/40 focus:border-rose-500"
                            : "border-slate-800 focus:ring-emerald-500/40 focus:border-emerald-500"
                    } ${className}`}
                {...props}
            />

            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1.5 text-xs text-rose-400"
                >
                    {error}
                </p>
            )}
        </div>
    )
}

export default Input