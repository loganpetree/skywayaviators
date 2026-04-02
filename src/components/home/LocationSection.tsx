import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function LocationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Visit Us
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Located at Lancaster Regional Airport, just south of Dallas
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-stretch">
          {/* Map */}
          <div className="md:col-span-3 rounded-2xl overflow-hidden shadow-lg min-h-[350px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3362.5!2d-96.7178!3d32.5922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e9f1d5b0b0001%3A0x0!2s730+Ferris+Rd+Suite+102%2C+Lancaster%2C+TX+75146!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 350 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Skyway Aviators Location"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <a
              href="https://maps.google.com/?q=730+Ferris+Rd+Suite+102+Lancaster+TX+75146"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-gray-200 p-5 flex flex-col justify-between hover:border-sky-200 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                <MapPin className="w-4 h-4 text-sky-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Address</p>
                <p className="text-sm font-medium text-gray-900 leading-snug">
                  730 Ferris Rd.<br />Suite 102, Lancaster TX
                </p>
              </div>
            </a>

            <a
              href="tel:+14699284678"
              className="group rounded-xl border border-gray-200 p-5 flex flex-col justify-between hover:border-sky-200 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                <Phone className="w-4 h-4 text-sky-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Call Us</p>
                <p className="text-sm font-medium text-gray-900">(469) 928-4678</p>
              </div>
            </a>

            <a
              href="mailto:info@skywayaviators.com"
              className="group rounded-xl border border-gray-200 p-5 flex flex-col justify-between hover:border-sky-200 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                <Mail className="w-4 h-4 text-sky-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-900">info@skywayaviators.com</p>
              </div>
            </a>

            <div className="rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                <Clock className="w-4 h-4 text-sky-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Hours</p>
                <p className="text-sm font-medium text-gray-900">Sunrise – Sunset<br />7 days a week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
