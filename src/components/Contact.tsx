'use client';

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
    <section id="contact" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="mb-4 text-center text-4xl font-black text-[#12345f] md:text-5xl">{t('contact.title')}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600">
          {t('contact.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            {contactLinks.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target={contact.external ? '_blank' : undefined}
                rel={contact.external ? 'noopener noreferrer' : undefined}
                className="group flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f08a24] hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f4f8ff] text-2xl text-[#12345f] transition-colors group-hover:bg-[#f08a24] group-hover:text-white">
                  {contact.icon}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#182230]">{contact.label}</span>
                  <span className="break-all text-base font-semibold text-[#b85c00]">
                    {contact.value}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="h-[400px] w-full overflow-hidden rounded-lg border-2 border-slate-200 shadow-lg">
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
