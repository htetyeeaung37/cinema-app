import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 bg-[#0F172A]">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-amber-400/5 blur-[120px] pointer-events-none" />

      <section className="relative z-10 w-full flex justify-center items-center py-8">
        <RegisterForm />
      </section>

      <div className="absolute bottom-3 w-full text-center text-slate-600 text-[10px] tracking-[0.2em] uppercase font-bold pointer-events-none">
        Secure Registration • JCGV Cinema
      </div>
    </main>
  );
}
