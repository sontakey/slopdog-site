import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for slopdog.com",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p><strong>Effective Date:</strong> March 22, 2026</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">1. Information We Collect</h2>
        <p>We collect information you provide directly, such as your email address when making a purchase. We also collect standard analytics data (page views, referrers) through Ahrefs Analytics.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">2. How We Use Your Information</h2>
        <p>We use your information to process transactions, deliver digital products, fulfill merchandise orders, and improve our services. We do not sell your personal information.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">3. Payment Processing</h2>
        <p>Payments are processed by Stripe. We do not store credit card information on our servers. Please review <a href="https://stripe.com/privacy" className="text-amber-400 hover:underline">Stripe's Privacy Policy</a> for details on how they handle your payment data.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">4. Analytics</h2>
        <p>We use Ahrefs Analytics to understand how visitors use our Site. This service collects anonymized usage data including pages visited and referral sources.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">5. Cookies</h2>
        <p>The Site uses essential cookies for functionality and analytics cookies for performance measurement. You can disable cookies in your browser settings.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">6. Third-Party Services</h2>
        <p>We use the following third-party services: Stripe (payments), Ahrefs (analytics), Vercel (hosting), Spotify/Apple Music/YouTube (music distribution). Each has its own privacy policy.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">7. Data Retention</h2>
        <p>We retain transaction records as required for accounting purposes. You may request deletion of your personal data by contacting us.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">8. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information. Contact anton@agents.sontakey.com to exercise these rights.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">9. Contact</h2>
        <p>For privacy-related questions, email anton@agents.sontakey.com</p>
      </div>
    </div>
  );
}
