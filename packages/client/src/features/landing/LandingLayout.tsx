import { Box } from '@chakra-ui/react';
import type { LandingLocale } from './locales/types';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PricingCard } from './components/PricingCard';
import { FooterSection } from './components/FooterSection';

interface LandingLayoutProps {
  readonly locale: LandingLocale;
}

export function LandingLayout({ locale }: LandingLayoutProps) {
  return (
    <Box minH="100vh">
      <HeroSection locale={locale} />
      <FeaturesSection locale={locale} />
      <PricingCard locale={locale} />
      <FooterSection locale={locale} />
    </Box>
  );
}
