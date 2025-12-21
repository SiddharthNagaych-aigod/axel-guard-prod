"use client";

import { useActionState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { submitFooterEmail } from "./actions"; // Import from the same directory

const initialState = {
  success: false,
  message: "",
};

export default function FooterForm() {
  const [state, formAction, isPending] = useActionState(submitFooterEmail, initialState);

  return (
    <div className="w-full">
      <form action={formAction} className="flex gap-2">
        <input 
          name="email"
          type="email" 
          required
          placeholder="Your email address" 
          className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
        />
        <button 
          type="submit"
          disabled={isPending}
          className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <>Send <Send size={18} /></>}
        </button>
      </form>
      {state.message && (
        <div className={`mt-3 text-sm flex items-center gap-2 ${state.success ? 'text-green-400' : 'text-red-400'}`}>
          {state.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {state.message}
        </div>
      )}
    </div>
  );
}
