import { House, SignOut } from "@phosphor-icons/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface TitleProps {
  Title: string;
}

export default function Header(props: TitleProps) {
  return (
    <header className="flex justify-between px-6 pt-6 pb-6 mb-16 text-2xl font-bold text-center shadow-lg">
      <Link href='/'>
        <House weight="fill" size={25} color="black" />
      </Link>
      <h3 className="text-slate-950 font-normal">{props.Title}</h3>
      <button onClick={() => signOut({ redirect: true })}>
        <SignOut size={25} color="black" />
      </button>
    </header>
  );
}
