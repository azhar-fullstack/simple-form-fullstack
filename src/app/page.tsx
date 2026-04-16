import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-100 px-4 py-16 dark:bg-zinc-900">
      <ContactForm />
    </div>
  );
}
