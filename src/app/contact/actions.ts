"use server";

export async function submitContactForm(prevState: any, formData: FormData) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwxYITJ6j7AkOPt2buEyWgcsC1jrKhpCQLNdAziTnEoIjwVX2dFF-HV03NNJf41G9E/exec";

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(rawData),
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", 
    });

    if (!response.ok) {
        console.error("Google Sheets API Error Status:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Google Sheets API Error Body:", errorText);
        return { success: false, message: `Failed to submit. Status: ${response.status}` };
    }

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
