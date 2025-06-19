// Header.tsx
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-8 py-8">
        <Link href="/">
          <Image
            src="https://react-task-management.vercel.app/assets/images/logo.svg"
            alt="Logo"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>
    </header>

  );
}
