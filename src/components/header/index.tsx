import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface TitleProps {
  Title: string;
}

export default function Header(props: TitleProps) {
  return (
    <header className="flex justify-between px-6 pt-6 pb-6 mb-16 text-2xl font-bold text-center shadow-lg">
      <Link href='/'>
        <HomeIcon className="h-6 w-6 text-slate-950"/>
      </Link>
      <h3 className="text-slate-950 font-normal">{props.Title}</h3>
      <button onClick={() => signOut({ redirect: true })}>
        <ArrowRightOnRectangleIcon className="h-6 w-6 text-slate-950" title="sair"/>
      </button>
    </header>
  );
}
