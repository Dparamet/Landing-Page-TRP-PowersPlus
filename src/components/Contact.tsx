'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const facebookPageUrl = 'https://facebook.com/TRPPowersplus';
  const facebookPluginUrl = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookPageUrl)}&tabs=timeline&width=500&height=440&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  const contactLinks = [
    {
      type: 'company',
      icon: 'company',
      label: t('contact.company'),
      value: 'TRP Powers Plus',
      copyValue: 'TRP Powers Plus',
    },
    {
      type: 'phone',
      icon: 'phone',
      label: t('contact.phone'),
      value: '+66 (0) 12-345-6789',
      copyValue: '+66012345678',
      href: 'tel:+66012345678',
    },
    {
      type: 'facebook',
      icon: 'facebook',
      label: 'Facebook',
      value: 'facebook.com/TRPPowersplus',
      href: facebookPageUrl,
      copyValue: facebookPageUrl,
      external: true,
    },
    {
      type: 'line',
      icon: 'line',
      label: 'Line',
      value: '@TRPPowersplus',
      copyValue: '@TRPPowersplus',
      href: 'https://line.me/ti/p/@TRPPowersplus',
      external: true,
    },
    {
      type: 'email',
      icon: 'email',
      label: t('contact.email'),
      value: 'TRPPowersplus@gmail.com',
      copyValue: 'TRPPowersplus@gmail.com',
      href: 'mailto:TRPPowersplus@gmail.com',
    },
    {
      type: 'address',
      icon: 'address',
      label: t('contact.address'),
      value: '123 Solar Street, Green Energy District Bangkok 10500, Thailand',
      copyValue: '123 Solar Street, Green Energy District Bangkok 10500, Thailand',
      href: 'https://maps.google.com/?q=123+Solar+Street,+Green+Energy+District,+Bangkok+10500,+Thailand',
      external: true,
    },
  ];

  const copyContact = async (type: string, value: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedType(type);
      window.setTimeout(() => setCopiedType(null), 1800);
    } catch {
      setCopiedType(null);
    }
  };

  const renderIcon = (icon: string) => {
    if (icon === 'company') {
      return (
        <Image
          src="/images/LogoTRP.webp"
          alt="TRP Powers Plus"
          width={40}
          height={40}
          className="h-8 w-8 object-contain"
        />
      );
    }

    if (icon === 'facebook') {
      return <span className="text-2xl font-black leading-none text-[#1877f2]">f</span>;
    }

    if (icon === 'line') {
      return <span className="text-[10px] font-black leading-none tracking-tight text-[#06c755]">LINE</span>;
    }

    const iconMap: Record<string, string> = {
      phone: '☎',
      email: '@',
      address: '⌖',
    };

    return <span className="text-lg font-black leading-none text-[#b85c00]">{iconMap[icon] ?? icon}</span>;
  };

  return (
    <section id="contact" className="section-reveal bg-[#f8fafc] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-4xl font-black text-[#12345f] md:text-5xl">{t('contact.title')}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600">
          {t('contact.description')}
        </p>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <div className="reveal-item overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-lg font-black text-[#12345f]">{t('contact.title')}</h3>
              <p className="mt-1 text-sm text-slate-600">{t('contact.description')}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {contactLinks.map((contact, index) => (
                <div key={index} className="group flex items-center gap-3 p-3 transition hover:bg-[#f4f8ff]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f4f8ff] text-center transition group-hover:bg-white">
                    {renderIcon(contact.icon)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[#182230]">{contact.label}</span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-[#b85c00]">
                      {contact.value}
                    </span>
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    {contact.href && (
                      <a
                        href={contact.href}
                        target={contact.external ? '_blank' : undefined}
                        rel={contact.external ? 'noopener noreferrer' : undefined}
                        className="rounded-md bg-[#12345f] px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#1e4f8f]"
                        aria-label={`${t('contact.open')} ${contact.label}`}
                      >
                        {t('contact.open')}
                      </a>
                    )}
                    {contact.copyValue && (
                      <button
                        type="button"
                        onClick={() => copyContact(contact.type, contact.copyValue)}
                        className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-[#12345f] transition hover:border-[#f08a24] hover:bg-[#fff7ed] hover:text-[#b85c00]"
                        aria-label={`${t('contact.copy')} ${contact.label}`}
                      >
                        {copiedType === contact.type ? t('contact.copied') : t('contact.copy')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-item overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-black text-[#12345f]">{t('contact.pagePreviewTitle')}</h3>
                <p className="mt-1 text-sm text-slate-600">{t('contact.pagePreviewDescription')}</p>
              </div>
              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-lg bg-[#b85c00] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8a4300]"
              >
                {t('contact.openPage')}
              </a>
            </div>
            <div className="h-[440px] bg-[#f4f8ff]">
              <iframe
                title="TRP Powers Plus Facebook page preview"
                src={facebookPluginUrl}
                width="100%"
                height="440"
                style={{ border: 0, overflow: 'hidden' }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                loading="lazy"
              />
            </div>
          </div>

          <div className="reveal-item overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-lg font-black text-[#12345f]">{t('contact.mapTitle')}</h3>
            </div>
            <div className="h-[440px] w-full">
              <iframe
                title="TRP Powers Plus office location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.451493193648!2d100.53169!3d13.7563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6b7a63b63%3A0x1234567890!2s123%20Solar%20Street%20Green%20Energy%20District%20Bangkok!5e0!3m2!1sen!2sth!4v1234567890123"
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
      </div>
    </section>
  );
}
