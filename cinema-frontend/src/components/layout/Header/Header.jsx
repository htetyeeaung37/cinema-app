"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Search,
  X,
  LogOut,
  Ticket,
  ChevronDown,
  PlayCircle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/movies?search=${encodeURIComponent(trimmed)}`,
        );
        const data = await res.json();
        setResults(data.slice(0, 5));
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setShowDropdown(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMovie = (movieId) => {
    router.push(`/movies/${movieId}`);
    setQuery("");
    setShowDropdown(false);
    setIsMobileSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelectMovie(results[0].id);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/login");
  };

  if (["/login", "/register"].includes(pathname)) return null;

  return (
    <nav className="fixed w-full z-50 top-0 bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="bg-amber-400 p-1 md:p-1.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-amber-400/20">
              <Ticket
                className="text-slate-950"
                size={22}
                fill="currentColor"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-white italic tracking-tighter">
                JCGV
              </span>
              <span className="text-lg md:text-xl font-medium text-amber-400/95 tracking-tight">
                Cinema
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-8">
            <div className="relative hidden md:block" ref={dropdownRef}>
              <div className="relative group">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${query ? "text-amber-400" : "text-slate-500"}`}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search Movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-64 lg:w-96 pl-11 pr-10 py-2.5 rounded-2xl bg-slate-900/50 border border-slate-700 text-white text-sm focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all placeholder:text-slate-600"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2  text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {showDropdown && results.length > 0 && (
                <div className="absolute top-full mt-3 w-full bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 space-y-1">
                    {results.map((movie) => (
                      <div
                        key={movie.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer group"
                        onClick={() => handleSelectMovie(movie.id)}
                      >
                        <div className="w-10 h-14 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-amber-400/30">
                            <PlayCircle size={20} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                            {movie.title}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider italic">
                            {movie.genre || "Action / Drama"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search size={22} />
            </button>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-400/10">
                    {user.name?.charAt(0)}
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-slate-500 hidden sm:block"
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2">
                    <div className="px-4 py-2 border-b border-slate-800 mb-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Account
                      </p>
                      <p className="text-sm font-bold text-white truncate">
                        {user.name}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 font-bold">
                <button
                  onClick={() => router.push("/login")}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-5 py-2 bg-amber-400 text-slate-950 text-sm rounded-xl hover:bg-amber-500 transition-all active:scale-95 shadow-lg shadow-amber-400/20"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-[#0F172A] z-[60] flex flex-col p-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <Search className="text-amber-400" size={20} />
            <input
              autoFocus
              type="text"
              placeholder="Search movies..."
              className="flex-1 bg-transparent border-none outline-none text-white text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setQuery("");
              }}
            >
              <X className="text-slate-500 hover:text-white" size={24} />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {results.map((movie) => (
              <div
                key={movie.id}
                className="text-white text-lg font-bold border-b border-slate-800 pb-4"
                onClick={() => handleSelectMovie(movie.id)}
              >
                {movie.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
