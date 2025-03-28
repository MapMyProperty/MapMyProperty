"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Icons } from "./Icons";
import { easeInOut, motion } from "framer-motion";

interface CustomLinkProps {
  path: string;
  children: React.ReactNode;
}

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/property", label: "Search" },
  { path: "/blogs", label: "Blogs" },
  { path: "/#emi-calculator", label: "EMI Calculator" },
  { path: "/contact", label: "Connect Us" },
];
const helperLinks = [
  { path: "/property?q=launch", label: "Launch" },
  { path: "/property?q=pre-launch", label: "Pre Launch" },
  { path: "/property?q=ready-to-move-in", label: "Ready to move in" },
  { path: "/property?q=apartments", label: "Apartments" },
  { path: "/property?q=villas", label: "Villas" },
  { path: "/property?q=plots", label: "Plots" },
  { path: "/property?q=farm-lands", label: "Farm Lands" },
];

const CustomLink: React.FC<CustomLinkProps> = ({ path, children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath =
    searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
  return (
    <Link
      className={`hover:text-black ${
        (currentPath === path || pathname === path) && "text-black font-medium"
      }`}
      href={path}
    >
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1, ease: easeInOut }}
      className="fixed top-0 z-50 bg-white backdrop-blur-lg flex flex-col items-center w-full bg-opacity-55 border-b"
    >
      <div className="flex h-16 px-4 md:px-8 xl:max-w-screen-xl justify-between w-full items-center">
        <div>
          <Link
            href={"/"}
            className="flex items-center top-3 left-10 absolute w-3/4 md:w-1/3"
          >
            <Image
              src="/logo.svg"
              alt="logo"
              width={48}
              height={56}
              className="w-full h-10"
            />
          </Link>
        </div>
        <nav className="hidden md:flex gap-8 text-sm text-stone-500">
          {navLinks.map(({ path, label }, idx) => (
            <CustomLink key={idx} path={path}>
              {label}
            </CustomLink>
          ))}
        </nav>
        <Icons.menu
          className="md:hidden w-6 h-6 cursor-pointer"
          onClick={toggleMenu}
        />
      </div>
      <div className="hidden md:flex w-full border-b" />
      <div className="hidden md:flex px-4 md:px-8 gap-8 py-1 text-xs lg:text-sm text-stone-500 xl:max-w-screen-xl justify-end w-full items-center">
        {helperLinks.map(({ path, label }, idx) => (
          <CustomLink key={idx} path={path}>
            {label}
          </CustomLink>
        ))}
      </div>
      {isMenuOpen && (
        <div className="fixed bg-white z-50 bg-opacity-95 top-0 right-0 w-64 xs:w-72 sm:w-80 md:w-96 lg:w-104 backdrop-blur-3xl overflow-hidden rounded-l-2xl p-2 shadow-md">
          <div className="flex justify-between p-8">
            <h2 className="text-sm font-semibold">Quick Links</h2>
            <button onClick={toggleMenu} aria-label="Close Menu">
              <Icons.close />
            </button>
          </div>
          <nav className="relative flex flex-col justify-center pb-20 px-8 gap-3 text-base text-stone-600">
            {navLinks.map(({ path, label }, idx) => (
              <CustomLink key={idx} path={path}>
                {label}
              </CustomLink>
            ))}
          </nav>
          <p className="text-xs text-center p-4 text-stone-600">
            © {new Date().getFullYear()}{" "}
            <Link href="/companies" className="hover:underline">
              Map My Property
            </Link>
            . All Rights Reserved.
          </p>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
