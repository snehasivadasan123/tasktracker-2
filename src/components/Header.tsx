import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-gray-100 px-6 py-3 flex justify-between items-center shadow-sm ">
      <Link href="/">
        <Image className="ml-30"
          src="https://react-task-management.vercel.app/assets/images/logo.svg"
          alt="Logo"
          width={120}
          height={40}
          priority
        />
      </Link>
      <nav>
        <Link href="/docs" className="text-sm underline text-gray-700 hover:text-black">
          Documentation
        </Link>
      </nav>
    </header>
  );
}
