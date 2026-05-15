'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useContactItems } from '@/hooks/useContactItems';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';

const LANDING_CONTACT_LIMIT = 6;

export default function Contact({ showAll = false }: { showAll?: boolean }) {
  const { t, language } = useLanguage();
  const companyProfile = useCompanyProfile();
  const contactItems = useContactItems(companyProfile);
  const visibleContactItems = showAll ? contactItems : contactItems.slice(0, LANDING_CONTACT_LIMIT);
  const hasMore = contactItems.length > visibleContactItems.length;
  const [copiedType, setCopiedType] = useState<string | null>(null);

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

    if (icon === 'line') {
      return <span className="text-[10px] font-black leading-none tracking-tight text-[#06c755]">LINE</span>;
    }

    const iconMap: Record<string, string> = {
      phone: '☎',
      facebook: 'f',
      instagram: 'IG',
      tiktok: '♪',
      email: '@',
      address: '⌖',
    };

    return (
      <span className={`text-lg font-black leading-none ${['facebook', 'instagram', 'tiktok'].includes(icon) ? 'text-[#1877f2]' : 'text-[#f08a24]'}`}>
        {iconMap[icon] ?? icon}
      </span>
    );
  };

  return (
    <section id="contact" className="section-reveal bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-4xl font-black text-[#0f2a5f] md:text-5xl">{t('contact.title')}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600">
          {t('contact.description')}
        </p>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="reveal-item overflow-hidden rounded-lg border border-[#f08a24] bg-white shadow-sm">
            <div className="border-b border-[#f08a24] p-5">
              <h3 className="text-lg font-black text-[#0f2a5f]">{t('contact.title')}</h3>
              <p className="mt-1 text-sm text-slate-600">{t('contact.description')}</p>
            </div>
            <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
              {visibleContactItems.map((contact) => (
                <div key={contact.id} className="group flex min-h-20 items-center gap-3 p-3 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#e3f2fd]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd] text-center transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:bg-white">
                    {renderIcon(contact.icon)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[#182230]">{contact.label[language]}</span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-[#f08a24]">
                      {contact.value[language]}
                    </span>
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    {contact.href && (
                      <a
                        href={contact.href}
                        target={contact.external ? '_blank' : undefined}
                        rel={contact.external ? 'noopener noreferrer' : undefined}
                        className="rounded-md bg-[#0f2a5f] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#1e4f8f] hover:shadow-md active:translate-y-0"
                        aria-label={`${t('contact.open')} ${contact.label[language]}`}
                      >
                        {t('contact.open')}
                      </a>
                    )}
                    {contact.copyValue && (
                      <button
                        type="button"
                        onClick={() => copyContact(contact.type, contact.copyValue)}
                        className="rounded-md border border-[#f08a24] px-2.5 py-1.5 text-xs font-bold text-[#0f2a5f] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#d66d0c] hover:bg-[#fff7ed] hover:text-[#d66d0c] active:translate-y-0"
                        aria-label={`${t('contact.copy')} ${contact.label[language]}`}
                      >
                        {copiedType === contact.type ? t('contact.copied') : t('contact.copy')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {hasMore ? (
              <div className="border-t border-[#f08a24] p-4 text-center">
                <Link
                  href="/contact"
                  className="inline-flex rounded-lg border border-[#f08a24] bg-white px-5 py-3 text-sm font-black text-[#0f2a5f] transition hover:bg-[#fff7ed] hover:text-[#d66d0c]"
                >
                  {language === 'th' ? 'อ่านเพิ่มเติมช่องทางติดต่อทั้งหมด' : 'View all contact channels'}
                </Link>
              </div>
            ) : null}
          </div>

          <div className="reveal-item overflow-hidden rounded-lg border border-[#f08a24] bg-white shadow-sm">
            <div className="border-b border-[#f08a24] p-5">
              <h3 className="text-lg font-black text-[#0f2a5f]">{t('contact.mapTitle')}</h3>
            </div>
            <div className="relative h-[300px] w-full sm:h-[360px] lg:h-[420px]">
              <iframe
                title="TRP Powers Plus office location map"
                src={companyProfile.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className="h-5 w-5 rounded-full border-4 border-white bg-red-600 shadow-lg" aria-hidden="true" />
                <span className="mt-1 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0f2a5f] shadow-md">
                  {companyProfile.name}
                </span>
              </div>
            </div>
            <div className="grid gap-3 border-t border-[#f08a24] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm font-black text-[#0f2a5f]">{t('contact.mapAddress')}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{companyProfile.address}</p>
              </div>
              <a
                href={companyProfile.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#f08a24] px-4 py-2.5 text-sm font-black text-white shadow-sm transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#d66d0c] hover:shadow-md active:translate-y-0"
              >
                {t('contact.openInMaps')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
