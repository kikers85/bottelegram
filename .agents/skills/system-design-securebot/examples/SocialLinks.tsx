'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import {
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   SocialLinks — SecureBot Lab Design System
   Social media links grid matching the reference design
   ═══════════════════════════════════════════════════ */

export type SocialPlatform =
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'telegram'
  | 'website'
  | 'email'
  | 'phone';

export interface SocialLinkItem {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface SocialLinksProps {
  title?: string;
  links: SocialLinkItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

const platformConfig: Record<SocialPlatform, {
  icon: React.ElementType;
  color: string;
  hoverBg: string;
}> = {
  youtube:   { icon: Youtube,       color: 'text-red-500',       hoverBg: 'hover:bg-red-50' },
  instagram: { icon: Instagram,     color: 'text-pink-500',      hoverBg: 'hover:bg-pink-50' },
  facebook:  { icon: Facebook,      color: 'text-blue-600',      hoverBg: 'hover:bg-blue-50' },
  linkedin:  { icon: Linkedin,      color: 'text-blue-700',      hoverBg: 'hover:bg-blue-50' },
  twitter:   { icon: Twitter,       color: 'text-sky-500',       hoverBg: 'hover:bg-sky-50' },
  telegram:  { icon: MessageCircle, color: 'text-sky-500',       hoverBg: 'hover:bg-sky-50' },
  website:   { icon: Globe,         color: 'text-brand-500',     hoverBg: 'hover:bg-brand-50' },
  email:     { icon: Mail,          color: 'text-text-secondary', hoverBg: 'hover:bg-surface-hover' },
  phone:     { icon: Phone,         color: 'text-text-secondary', hoverBg: 'hover:bg-surface-hover' },
};

const colStyles: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function SocialLinks({
  title = 'Follow us on social media',
  links,
  columns = 2,
  className,
}: SocialLinksProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn('card-base p-5', className)}
    >
      <h3 className="font-body text-base font-semibold text-text-primary mb-4">
        {title}
      </h3>

      <div className={cn('grid gap-2', colStyles[columns])}>
        {links.map((link) => {
          const config = platformConfig[link.platform];
          const Icon = config.icon;

          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl',
                'text-sm text-text-secondary transition-all duration-150',
                'hover:text-text-primary group',
                config.hoverBg,
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', config.color)} />
              <span className="truncate">{link.label}</span>
              <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Default social links for demo ─── */
export const defaultSocialLinks: SocialLinkItem[] = [
  { platform: 'youtube',   label: 'YouTube',       href: '#' },
  { platform: 'instagram', label: 'Instagram',     href: '#' },
  { platform: 'facebook',  label: 'Facebook',      href: '#' },
  { platform: 'linkedin',  label: 'LinkedIn',      href: '#' },
  { platform: 'email',     label: 'bot@gmail.com', href: 'mailto:bot@gmail.com' },
  { platform: 'phone',     label: '+30970903990',  href: 'tel:+30970903990' },
];

SocialLinks.displayName = 'SocialLinks';
export default SocialLinks;
