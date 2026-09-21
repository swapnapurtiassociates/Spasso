import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';

export default function ConfirmationPage() {
  const [location] = useLocation();
  const name = new URLSearchParams(location.split('?')[1] || '').get('name');

  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-[#07111f] px-4 py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.24),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(96,165,250,0.16),transparent_34%)]" aria-hidden="true" />
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-white/30 bg-white/10 p-8 text-center shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-14">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-300/70 bg-blue-500/20 text-blue-200 shadow-[0_0_35px_rgba(96,165,250,0.35)]">
          <CheckCircle2 size={42} strokeWidth={1.7} />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">Inquiry received</p>
        <h1 className="font-serif text-4xl font-bold md:text-5xl">Thank you{name ? `, ${name}` : ''}.</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-slate-300">
          Our team has received your project details and will be in touch shortly. A confirmation email has been sent to your inbox.
        </p>
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm text-slate-200">
          <Mail size={18} className="shrink-0 text-blue-300" />
          <span>Please check your inbox, and your spam folder if needed.</span>
        </div>
        <Button asChild className="mt-9 h-12 rounded-xl border-2 border-white/60 bg-linear-to-r from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] px-7 font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(37,99,235,0.5)]">
          <Link href="/">
            Return to Homepage
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    </main>
  );
}