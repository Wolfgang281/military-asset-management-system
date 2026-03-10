const AuthLoader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 gap-8">
      {/* Outer ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border-2 border-slate-800" />
        <div className="absolute h-24 w-24 rounded-full border-t-2 border-amber-500 animate-spin" />

        {/* Inner ring */}
        <div className="absolute h-16 w-16 rounded-full border-2 border-slate-800" />
        <div
          className="absolute h-16 w-16 rounded-full border-b-2 border-amber-400 animate-spin"
          style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
        />

        {/* Shield icon center */}
        <div className="relative flex h-10 w-10 items-center justify-center rounded bg-amber-500/10 border border-amber-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-amber-400"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-bold tracking-[0.3em] text-amber-400 uppercase">
          Verifying Credentials
        </p>
        <p className="text-xs tracking-widest text-slate-600 uppercase">
          Military Asset Management System
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 w-1 rounded-full bg-amber-500/60 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthLoader;
