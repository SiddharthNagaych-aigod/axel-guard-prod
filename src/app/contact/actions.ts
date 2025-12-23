"use server";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitContactForm(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    mobile: formData.get("mobile") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
    source: "Contact Page",
    customUrl: "https://9badee52-4d9c-4d54-813e-38638c4db7ee.neodove.com/integration/custom/05d027a2-97b5-423c-94c6-1a29311fc57e/leads"
  };

  try {
    const { submitToNeoDove } = await import("@/lib/neodove");
    const result = await submitToNeoDove(data);
    return result;
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
