import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-[120px] pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tight">Terms of Service</h1>
          <p className="text-gray-500 mb-12 text-lg">Last Updated: December 22, 2024</p>
          
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-black prose-p:text-gray-600 prose-li:text-gray-600">
             <p>
              Welcome to AxelGuard. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing this website, you accept these terms and conditions in full. Do not continue to use AxelGuard&apos;s website if you do not accept all of the terms and conditions stated on this page.
            </p>

            <h3>2. Intellectual Property</h3>
            <p>
              Unless otherwise stated, AxelGuard and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may view and/or print pages from https://axel-guard.com for your own personal use subject to restrictions set in these terms and conditions.
            </p>

            <h3>3. Restrictions</h3>
            <p>
              You are specifically restricted from all of the following:
            </p>
            <ul>
              <li>Publishing any website material in any other media without prior consent.</li>
              <li>Selling, sublicensing, and/or otherwise commercializing any website material.</li>
              <li>Using this website in any way that is or may be damaging to this website.</li>
              <li>Using this website contrary to applicable laws and regulations.</li>
            </ul>

            <h3>4. Limitation of Liability</h3>
            <p>
              In no event shall AxelGuard, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website. AxelGuard shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
            </p>

            <h3>5. Indemnification</h3>
            <p>
              You hereby indemnify to the fullest extent AxelGuard from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.
            </p>

            <h3>6. Governing Law</h3>
            <p>
              These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
