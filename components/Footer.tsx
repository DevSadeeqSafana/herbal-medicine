import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Cosmopolitan University</h3>
                <p className="text-sm text-primary-200">Herbal Medicine</p>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              In partnership with Zee&apos;s Herbal Pharmacy, offering quality herbal medicine education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="text-gray-300 hover:text-white transition-colors">
                  Programmes
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Programmes</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Certificate Programmes</li>
              <li>Advanced Phytotherapy</li>
              <li>Traditional Medicine</li>
              <li>Professional Diploma</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Amma House, Plot 432, Yakubu J. Pam Street, Opposite National Hospital, CBD, Abuja</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>+234 806 559 0444 | +234 805 208 0828 | +234 815 981 0601</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>info@cosmopolitan.edu.ng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} Cosmopolitan University. All rights reserved. | In partnership with Zee&apos;s Herbal Pharmacy
          </p>
        </div>
      </div>
    </footer>
  );
}
