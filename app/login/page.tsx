import LoginForm from '@/app/ui/login-form';
import { Package, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Product Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -ml-20 -mb-20" />

        {/* Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Kargo</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Smart Inventory Management for Modern Business
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Streamline your operations with AI-powered forecasting, real-time tracking, and seamless team collaboration.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Analytics</h3>
                <p className="text-sm text-slate-400">Track performance instantly</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Reliable</h3>
                <p className="text-sm text-slate-400">Enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-500">
          <span>© 2024 Kargo Inc.</span>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
