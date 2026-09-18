const PageLoader = ({ label }) => {
    return (
        <div className="grid min-h-[60vh] place-items-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-500" />
                {label && (
                    <p className="text-sm text-slate-500">{label}</p>
                )}
            </div>
        </div>
    )
}

export default PageLoader