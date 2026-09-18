const Button = ({ loading, children, ...props }) => {
    return (
        <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2
                rounded-lg bg-emerald-500 py-2.5 font-medium text-slate-950
                transition hover:bg-emerald-400 active:bg-emerald-600
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                disabled:cursor-not-allowed disabled:opacity-60"
            {...props}
        >
            {loading && (
                <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                    />
                    <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
            )}
            {children}
        </button>
    )
}

export default Button