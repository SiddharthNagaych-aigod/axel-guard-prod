import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-[120px] pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 mb-12 text-lg">Last Updated: December 22, 2024</p>
          
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-black prose-p:text-gray-600 prose-li:text-gray-600">
            <p>
              At AxelGuard, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We may collect personal information such as your name, email address, phone number, and company details when you fill out forms on our website (e.g., contact forms, quote requests). We also collect non-personal data through cookies and analytics tools to improve user experience.
            </p>

            <h3>2. How We Use Your Information</h3>
            <p>
              The information we collect is used to:
            </p>
            <ul>
              <li>Provide and improve our services and products.</li>
              <li>Respond to your enquiries and support requests.</li>
              <li>Send you updates, newsletters, and promotional materials (you can opt-out at any time).</li>
              <li>Analyze website traffic and user behavior to enhance our platform.</li>
            </ul>

            <h3>3. Data Sharing and Security</h3>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our website or conducting our business, provided they agree to keep this information confidential. We implement robust security measures to protect your data from unauthorized access.
            </p>

            <h3>4. Cookies</h3>
            <p>
              Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect the functionality of certain features.
            </p>

            <h3>5. Your Rights</h3>
            <p>
              You have the right to access, correct, or delete your personal information. If you wish to exercise these rights or have any questions about our privacy practices, please contact us at info@axel-guard.com.
            </p>

            <h3>6. Changes to This Policy</h3>
            <p>
              We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
