import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
      <div className="text-center">
        <h1 className="text-9xl text-zinc-800 font-bold animate-bounce">404</h1>
        <h2 className="mt-4 text-3xl text-pri font-semibold">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-400">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-lg text-zinc-800 font-medium transition-all hover:bg-yellow-500"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
