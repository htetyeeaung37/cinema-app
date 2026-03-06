"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const hideFooterPaths = ["/login", "/register"];

  if (hideFooterPaths.includes(pathname)) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0F172A] border-t border-slate-800 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© {currentYear} JCGV CINEMA. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 italic uppercase">
              Designed with ❤️ By
            </span>
            <span className="text-white border-b border-amber-400">
              Htet Yee Aung
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
