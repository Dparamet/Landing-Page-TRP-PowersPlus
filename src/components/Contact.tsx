'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  // Contact information with links
  const contactLinks = [
    {
      type: 'phone',
      icon: '📞',
      label: 'Phone',
      value: '+66 (0) 12-345-6789',
      href: 'tel:+66012345678'
    },
    {
      type: 'facebook',
      icon: '📘',
      label: 'Facebook',
      value: 'facebook.com/TRPPowersplus',
      href: 'https://facebook.com/TRPPowersplus',
      external: true
    },
    {
      type: 'line',
      icon: '💬',
      label: 'Line',
      value: '@TRPPowersplus',
      href: 'https://line.me/ti/p/@TRPPowersplus',
      external: true
    },
    {
      type: 'email',
      icon: '✉️',
      label: 'Email',
      value: 'TRPPowersplus@gmail.com',
      href: 'mailto:TRPPowersplus@gmail.com'
    },
    {
      type: 'address',
      icon: '📍',
      label: 'Office Address',
      value: '123 Solar Street, Green Energy District Bangkok 10500, Thailand',
      href: 'https://maps.google.com/?q=123+Solar+Street,+Green+Energy+District,+Bangkok+10500,+Thailand',
      external: true
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-orange-600 mb-4">{t('contact.title')}</h2>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          {t('contact.description')}
        </p>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Info */}
          <div className="space-y-6">
            {contactLinks.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target={contact.external ? '_blank' : undefined}
                rel={contact.external ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-all duration-200 group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl shrink-0 group-hover:bg-orange-700 transition-colors">
                  {contact.icon}
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm">{contact.label}</span>
                  <span className="text-orange-600 hover:text-orange-700 font-medium text-base break-all">
                    {contact.value}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Right Column: Map */}
          <div className="w-full h-[400px] rounded-xl shadow-lg overflow-hidden border-2 border-orange-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.451493193648!2d100.53169!3d13.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6b7a63b63b63%3A0x1234567890!2s123%20Solar%20Street%20Green%20Energy%20District%20Bangkok!5e0!3m2!1sen!2sth!4v1234567890123"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>


      </div>
    </section>
  );
}
