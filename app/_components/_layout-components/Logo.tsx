"use client";

import { useRouter } from "next/navigation";
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const Logo = ({ disableLink = false }: { disableLink?: boolean }) => {
  const router = useRouter();
  return (
    <div
      className={`flex items-center gap-2 justify-center text-xl md:text-3xl cursor-pointer ${nunito.className}`}
      onClick={() => {
        if (!disableLink) {
          router.push("/");
        }
      }}
    >
      <p className="text-tertiary font-bold">get</p>
      <p className="text-primary font-bold">&gt;</p>
      <p className="text-tertiary font-bold">in</p>
    </div>
  );
};

export default Logo;
