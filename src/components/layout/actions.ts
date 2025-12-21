"use server";

import { submitToNeoDove } from "@/lib/neodove";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitFooterEmail(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { success: false, message: "Please enter your email." };
  }

  const data = {
    name: "Newsletter Subscriber", // Default name
    mobile: "", // Not collected in footer
    email: email,
    subject: "Newsletter Subscription / Footer Enquiry",
    message: "User subscribed via footer email input.",
    source: "Footer", 
  };

  try {
    const result = await submitToNeoDove(data);
    return result;
  } catch (error) {
    console.error("Footer Submission Error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
