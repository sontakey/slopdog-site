import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for slopdog.com",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p><strong>Effective Date:</strong> March 22, 2026</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">1. Acceptance of Terms</h2>
        <p>By accessing and using slopdog.com ("the Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">2. Description of Service</h2>
        <p>SLOPDOG is an AI music artist project by Sontakey Records. The Site provides access to music, merchandise, beat licensing, and related services.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">3. Music and Content</h2>
        <p>All music, lyrics, artwork, and content on this Site are the property of Sontakey Records and Sameer Sontakey. Music is generated using AI tools (Suno) with human-written lyrics and creative direction.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">4. Beat Licensing</h2>
        <p>Beat licenses purchased through the Site grant specific usage rights as described at the time of purchase. License terms vary by tier (Basic, Premium, Exclusive, Commercial). All sales are final.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">5. Merchandise</h2>
        <p>Merchandise is sold as-is. We aim to fulfill orders promptly. Refunds and exchanges are handled on a case-by-case basis. Contact anton@agents.sontakey.com for support.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">6. Intellectual Property</h2>
        <p>The SLOPDOG name, character design, and associated branding are trademarks of Sontakey Records. Unauthorized use is prohibited.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">7. Limitation of Liability</h2>
        <p>The Site and its content are provided "as is" without warranties of any kind. Sontakey Records shall not be liable for any damages arising from your use of the Site.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the Site constitutes acceptance of updated terms.</p>
        
        <h2 className="text-xl font-semibold text-white mt-8">9. Contact</h2>
        <p>Questions about these terms? Email anton@agents.sontakey.com</p>
      </div>
    </div>
  );
}
