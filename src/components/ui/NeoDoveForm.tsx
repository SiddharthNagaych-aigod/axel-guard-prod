"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitLead } from "@/app/actions";

interface NeoDoveFormProps {
  onSuccess?: () => void;
  source?: string; // To track where the lead came from (e.g., "Contact Page", "Popup", "PDF Gate")
  className?: string;
  showSubject?: boolean;
  showMessageBox?: boolean;
  customUrl?: string;
}

export default function NeoDoveForm({ 
  onSuccess, 
  source = "Website", 
  className = "",
  showSubject = false,
  showMessageBox = false,
  customUrl
}: NeoDoveFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      mobile: formData.get("mobile") as string,
      subject: showSubject ? (formData.get("subject") as string) : undefined,
      message: showMessageBox ? (formData.get("message") as string) : undefined,
      source: source,
      customUrl: customUrl,
    };

    try {
      const result = await submitLead(data);
      if (result.success) {
        setStatus({ success: true, message: "Submitted successfully!" });
        if (onSuccess) onSuccess();
      } else {
        setStatus({ success: false, message: result.message || "Failed to submit." });
      }
    } catch (error) {
      console.error(error);
      setStatus({ success: false, message: "Submission error." });
    }

    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">Name</label>
        <input 
          name="name"
          type="text" 
          required
          className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
          placeholder="Your Name" 
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">Mobile Number</label>
        <input 
          name="mobile"
          type="tel" 
          required
          pattern="[0-9]{10}"
          title="10-digit mobile number"
          className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
          placeholder="9876543210" 
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
        <input 
          name="email"
          type="email" 
          required
          className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
          placeholder="email@example.com" 
        />
      </div>

      {showSubject && (
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">Subject</label>
          <input 
            name="subject"
            type="text" 
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
            placeholder="Subject" 
          />
        </div>
      )}

      {showMessageBox && (
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">Message</label>
          <textarea 
            name="message"
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors resize-none" 
            placeholder="Details..."
          ></textarea>
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
      >
        {isPending ? <Loader2 className="animate-spin" size={18} /> : (
            <>
                Submit <Send size={16} />
            </>
        )}
      </button>

      {status && (
        <p className={`text-sm text-center ${status.success ? "text-green-600" : "text-red-500"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
