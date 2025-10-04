import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";

function Footer() {
  return (
    <footer className="md:p-6  bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* School Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600  rounded-xl flex items-center justify-center">
                <GraduationCap className="w-10 h-6 text-white" />
              </div>
              <h3 className="text-base md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                Qurrathul Ain Sunni Higher Secondary Madrasa
              </h3>
            </div>
            <p className="text-xs md:text-md text-slate-300 mb-8 leading-relaxed max-w-md">
              Building a generation rooted in Islamic values, where knowledge
              and character come together for success in this world and the
              hereafter.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center text-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                <div>
                  <p className="text-sm text-slate-400">Students</p>
                  <p className="font-semibold">100+</p>
                </div>
              </div>
              <div className="flex items-center text-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                <div>
                  <p className="text-sm text-slate-400">Excellence</p>
                  <p className="font-semibold">Since 2010</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center">
              {[
                {
                  icon: Facebook,
                  label: "Facebook",
                  color: "hover:bg-blue-600",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                  color: "hover:bg-pink-600",
                },
                { icon: Youtube, label: "YouTube", color: "hover:bg-red-600" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="/"
                  aria-label={social.label}
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110`}
                >
                  <social.icon
                    className="w-5 h-5 flex-shrink-0"
                    strokeWidth={2}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick Links">
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Quick Links
            </h4>
            <ul className="space-y-3 ">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "History", href: "/about" },
                { name: "Events", href: "/about" },
                { name: "Gallery", href: "/about" },
                { name: "Support", href: "/support" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group no-underline"
                  >
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info + Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              Get in Touch
            </h4>

            <address className="space-y-4 mb-8 not-italic text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1 ">
                  <Mail className="w-6 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Email</p>
                  <a
                    href="mailto:qurrathulainsunnimadrassa@gmail.com"
                    className="text-xs hover:text-emerald-400 transition-colors no-underline"
                  >
                    qurrathulainsunnimadrassa@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 no-underline h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Phone</p>
                  <a
                    href="tel:+919847550940"
                    className="hover:text-blue-400 transition-colors no-underline"
                  >
                    +91 9847550940
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Address</p>
                  <p>
                    Urulikkunnu, Koduvally
                    <br />
                    Calicut, Kerala
                  </p>
                </div>
              </div>
            </address>

            {/* Newsletter */}
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
              <h5 className="font-medium mb-3">Stay Updated</h5>
              <p className="text-xs text-slate-400 mb-4">
                Subscribe to receive updates and news
              </p>
              <form>
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="submit"
                  className="mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-600  text-white py-2 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm ">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-xs text-center md:text-left">
              © 2025–26 Qurrathul Ain Sunni Higher Secondary. All Rights
              Reserved.
            </p>
            <a
              href="https://www.aionespark.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 text-center text-sm no-underline"
            >
              <span>Proudly Powered by:</span>
              <span className="font-medium bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent ">
                AioneSpark TechHive LLP
              </span>
            </a>
            <div className="flex gap-6 text-sm">
              <a
                href="/"
                className="text-slate-400 hover:text-white no-underline transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/"
                className="text-slate-400 no-underline hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
