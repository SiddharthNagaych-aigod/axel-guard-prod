export async function submitToNeoDove(data: {
  name: string;
  mobile: string;
  email: string;
  subject?: string;
  message?: string;
  source?: string;
  customUrl?: string;
}) {
  // The full URL including the unique subdomain and integration ID
  // Example: https://9badee52...neodove.com/integration/custom/ce0c.../leads
  const ENDPOINT_URL = data.customUrl || process.env.NEODOVE_URL;
  
  if (!ENDPOINT_URL) {
    console.error("NEODOVE_URL is missing in environment variables.");
    return { success: false, message: "Configuration error." };
  }

  const BASE_URL = ENDPOINT_URL;

  // Map fields to NeoDove expected parameters
  const queryParams = new URLSearchParams({
    name: data.name,
    mobile: data.mobile,
    email: data.email,
  });

  if (data.subject) queryParams.append("detail1", data.subject);
  if (data.message) queryParams.append("detail2", data.message);
  if (data.source) queryParams.append("source", data.source);

  const url = `${BASE_URL}?${queryParams.toString()}`;

  console.log("📡 [NeoDove Utility] Fetching URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("NeoDove API Error:", response.status, response.statusText);
      return { success: false, message: "Failed to submit to CRM." };
    }

    return { success: true, message: "Details submitted successfully!" };
  } catch (error) {
    console.error("NeoDove Submission Error:", error);
    return { success: false, message: "Network error occurred." };
  }
}
