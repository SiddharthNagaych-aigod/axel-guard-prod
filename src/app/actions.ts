"use server";

import { submitToNeoDove } from "@/lib/neodove";

export async function submitLead(data: {
  name: string;
  mobile: string;
  email: string;
  subject?: string;
  message?: string;
  source?: string;
}) {
  console.log("-----------------------------------------");
  console.log("🚀 [Server Action] submitLead called");
  console.log("Source:", data.source);
  console.log("Data:", { ...data, mobile: "***" }); // Mask sensitive info in logs
  
  const result = await submitToNeoDove(data);
  
  console.log("✅ [NeoDove Result]:", result);
  return result;
}
