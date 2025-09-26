import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">
                <span className="font-medium">Office:</span><br />
                730 Ferris Rd. Suite 102<br />
                Lancaster, Tx 75146
              </p>
              <p className="text-sm">
                <span className="font-medium">Call:</span><br />
                +1(469)9284-678
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span><br />
                info@skywayaviators.com
              </p>
              <p className="text-sm">
                <span className="font-medium">Site:</span><br />
                skywayaviators.com
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="text-sm ">Fleet</a></li>
              <li><a href="#" className="text-sm ">Careers</a></li>
              <li><a href="#" className="text-sm ">Programs</a></li>
              <li><a href="#" className="text-sm ">Finance</a></li>
              <li><a href="#" className="text-sm ">Time Build</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="text-sm ">Charter Flights</a></li>
              <li><a href="#" className="text-sm ">Aircraft Management</a></li>
              <li><a href="#" className="text-sm ">Maintenance</a></li>
              <li><a href="#" className="text-sm ">Pilot Training</a></li>
            </ul>
          </div>

          {/* Chat Widget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Questions?</h3>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-semibold text-sm">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Have a question?</p>
                  <p className="text-xs text-gray-400">Text us here</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Start Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2022 Skyway Aviators. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
