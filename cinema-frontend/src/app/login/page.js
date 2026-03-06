import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 bg-[#0F172A]">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-amber-400/10 blur-[100px] pointer-events-none" />

      <section className="relative z-10 w-full flex justify-center items-center">
        <LoginForm />
      </section>

      <div className="absolute bottom-10 w-full text-center text-slate-600 text-[10px] tracking-[0.2em] uppercase font-bold pointer-events-none">
        Secure Login • JCGV Cinema
      </div>
    </main>
  );
}
