import Link from "next/link";

const linkClass =
  "text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-white";

export function AppNav() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3" aria-label="Main">
        <Link href="/" className={linkClass}>
          Form
        </Link>
        <Link href="/list" className={linkClass}>
          Saved
        </Link>
      </nav>
    </header>
  );
}
