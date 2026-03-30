'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  HandMetal,
  Bot,
  Users,
  Zap,
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';

import { StatCard, StatsGrid } from '../components/modules/stats';
import { FeatureCard } from '../components/modules/moderation/ModerationCard';
import { Button } from '../components/ui/Button';

/* ═══════════════════════════════════════════════════
   Dashboard Page — SecureBot Lab
   Main dashboard matching the reference design
   ═══════════════════════════════════════════════════ */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export function Dashboard() {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ─── Section: Group Stats ─── */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Group stats</h2>
          <Button variant="secondary" size="sm">
            View full stats
          </Button>
        </div>

        <StatsGrid columns={3}>
          <StatCard
            label="Total users"
            value="12,562"
            trend="neutral"
            trendValue="5 %"
            subtitle="5 %"
            delay={0}
          />
          <StatCard
            label="Incoming users"
            value="+462"
            trend="up"
            trendValue="+12.3%"
            delay={0.08}
          />
          <StatCard
            label="Outgoing users"
            value="-52"
            trend="down"
            trendValue="-2.1%"
            delay={0.16}
          />
        </StatsGrid>
      </section>

      {/* ─── Section: Feature Cards Grid ─── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-card-gap">
          {/* Row 1 */}
          <FeatureCard
            title="Manual moderation"
            icon={<HandMetal className="w-5 h-5" />}
            gradient="blue"
            delay={0.24}
          />
          <FeatureCard
            title="Interactive settings"
            icon={<Zap className="w-5 h-5" />}
            gradient="cyan"
            delay={0.32}
          />

          {/* Row 2 */}
          <FeatureCard
            title="Auto moderation"
            icon={<Bot className="w-5 h-5" />}
            gradient="green"
            delay={0.40}
          />

          {/* Social Media Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="card-base p-5"
          >
            <h3 className="font-body text-base font-semibold text-text-primary mb-4">
              Follow us on social media
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <SocialLink icon={<Youtube className="w-4 h-4" />} label="YouTube" href="#" />
              <SocialLink icon={<Instagram className="w-4 h-4" />} label="Instagram" href="#" />
              <SocialLink icon={<Facebook className="w-4 h-4" />} label="Facebook" href="#" />
              <SocialLink icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" href="#" />
              <SocialLink icon={<Mail className="w-4 h-4" />} label="bot@gmail.com" href="mailto:bot@gmail.com" />
              <SocialLink icon={<Phone className="w-4 h-4" />} label="+30970903990" href="tel:+30970903990" />
            </div>
          </motion.div>

          {/* Row 3 */}
          <FeatureCard
            title="Users settings"
            icon={<Users className="w-5 h-5" />}
            gradient="purple"
            delay={0.56}
          />
        </div>
      </section>
    </motion.div>
  );
}

/* ─── Helper: Social Link ─── */
function SocialLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand-500 transition-colors duration-150"
    >
      <span className="text-text-muted">{icon}</span>
      <span className="truncate">{label}</span>
    </a>
  );
}

Dashboard.displayName = 'Dashboard';
export default Dashboard;
