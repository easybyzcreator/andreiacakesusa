import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Admin from './components/Admin';
import Footer from './components/Footer';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Settings } from './types';
import { Toaster } from 'sonner';
import { ensureDefaultCatalogSeeded } from './lib/catalogInit';
import { DEFAULT_CAKE_CONFIG } from './data/defaultCatalog';
import { parseMoneyValue } from './lib/money';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    logo: 'https://i.ibb.co/JTytkqY/IMG-6642.png',
    primaryColor: '#865d39',
    whatsappNumber: '',
    whatsappCountryCode: '+1',
    slug: 'andreiacakesusa',
    brandName: 'Andréia Cakes USA',
    slogan: 'Custom & Artisanal Cakes and Sweets',
    whatsappClosingMessage: 'Thank you for your order! We will contact you shortly to confirm all details.',
    backgroundImage: 'https://i.ibb.co/X0vYy7L/cakes.png',
    glassColor: 'rgba(255, 255, 255, 0.4)',
    textColor: '#000000',
    categoryTextColor: '#000000',
    brandNameColor: '#000000',
    detailsPriceColor: '#865d39',
    showCustomDietButton: false,
    showDetoxInstructionsButton: false,
    showStorageInstructionsButton: true,
    minOrderValue: 0,
    language: 'en',
    currency: 'USD',
    tagTitle: 'ALUNO(A)/MENTORADO(A)',
    tagLogo: '/images/andreia-cakes-tag.png',
    tagUrl: 'https://andreiacakesusa.com/',
    introEnabled: true,
    introTitle: 'Andréia Cakes USA',
    introSubtitle: 'Custom & Artisanal Cakes and Sweets',
    introDescription: 'Crafting unforgettable celebration cakes and handcrafted sweets with love and premium ingredients.',
    introButtonText: 'VIEW OUR MENU',
    introBottomText: 'ARTISANAL • SWEETS • CELEBRATION',
    selectorEnabled: false,
    selectorTitle: 'Andréia Cakes USA',
    selectorSubtitle: 'Choose your experience',
    catalog1Title: 'Custom Cakes',
    catalog1Image: 'https://i.ibb.co/jv6dv9px/patitour-2026-09-16-T120209-078.png',
    catalog1Desc: 'Handcrafted personalized cakes for special occasions.',
    catalog1Slogan: 'Artisanal Cakes & Sweets',
    catalog1Active: true,
    catalog2Title: 'Party Sweets & Truffles',
    catalog2Image: 'https://i.ibb.co/X0vYy7L/cakes.png',
    catalog2Desc: 'Traditional and gourmet truffles, brigadeiros and sweets.',
    catalog2Slogan: 'Sweet moments made special',
    catalog2Active: false,
    catalog3Title: 'Desserts',
    catalog3Image: 'https://i.ibb.co/X0vYy7L/cakes.png',
    catalog3Desc: 'Gourmet jars, cakes and delicacies.',
    catalog3Slogan: 'Delightful artisanal desserts',
    catalog3Active: false,
    catalog4Title: 'Special Celebrations',
    catalog4Image: 'https://i.ibb.co/X0vYy7L/cakes.png',
    catalog4Desc: 'Custom themes and celebration packages.',
    catalog4Slogan: 'Tailored to your dream party',
    catalog4Active: false,
    cakeSizes: [...DEFAULT_CAKE_CONFIG.cakeSizes],
    cakeDoughs: [...DEFAULT_CAKE_CONFIG.cakeDoughs],
    cakeFillings: [...DEFAULT_CAKE_CONFIG.cakeFillings],
    cakeFillingsMax: DEFAULT_CAKE_CONFIG.cakeFillingsMax,
    cakeToppings: [...DEFAULT_CAKE_CONFIG.cakeToppings],
    cakeToppers: [...DEFAULT_CAKE_CONFIG.cakeToppers]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL for admin path
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
      setIsAdmin(true);
    }

    // Ensure initial default catalog is safely seeded in Firebase
    ensureDefaultCatalogSeeded();

    // Load settings for global styles
    const unsub = onSnapshot(doc(db, 'configuracoes', 'geral'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Settings;
        if (data.minOrderValue !== undefined && data.minOrderValue !== null) {
          data.minOrderValue = parseMoneyValue(data.minOrderValue);
        }
        // Ensure strictly US configuration
        data.language = 'en';
        data.currency = 'USD';
        data.whatsappCountryCode = '+1';
        data.cakeSizes = (data.cakeSizes && data.cakeSizes.length > 0) ? data.cakeSizes : [...DEFAULT_CAKE_CONFIG.cakeSizes];
        data.cakeDoughs = (data.cakeDoughs && data.cakeDoughs.length > 0) ? data.cakeDoughs : [...DEFAULT_CAKE_CONFIG.cakeDoughs];
        data.cakeFillings = (data.cakeFillings && data.cakeFillings.length > 0) ? data.cakeFillings : [...DEFAULT_CAKE_CONFIG.cakeFillings];
        data.cakeFillingsMax = data.cakeFillingsMax || DEFAULT_CAKE_CONFIG.cakeFillingsMax;
        data.cakeToppings = (data.cakeToppings && data.cakeToppings.length > 0) ? data.cakeToppings : [...DEFAULT_CAKE_CONFIG.cakeToppings];
        data.cakeToppers = (data.cakeToppers && data.cakeToppers.length > 0) ? data.cakeToppers : [...DEFAULT_CAKE_CONFIG.cakeToppers];
        setSettings(prev => ({ ...prev, ...data, language: 'en', currency: 'USD', whatsappCountryCode: '+1' }));
        setLoading(false);

        // Update Page Title
        if (data.brandName) {
          document.title = data.brandName;
        }

        // Update PWA Apple Touch Icon and Favicon
        const currentIconUrl = data.pwaIcon || 'https://i.postimg.cc/g0nt3BKf/patitour-2026-09-21T134229-803.png';
        const appleTouchIcon = document.getElementById('apple-touch-icon');
        if (appleTouchIcon) {
          appleTouchIcon.setAttribute('href', currentIconUrl);
        }
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
          favicon.setAttribute('href', currentIconUrl);
        }

        // Update Theme Color
        const themeColorMeta = document.getElementById('theme-color');
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', data.primaryColor || '#865d39');
        }

        // Set Glass Color CSS Variable
        const glassColor = data.glassColor || 'rgba(255, 255, 255, 0.4)';
        const finalGlassColor = (glassColor.startsWith('#') && glassColor.length === 7) 
          ? `${glassColor}66` 
          : glassColor;
        document.documentElement.style.setProperty('--glass-color', finalGlassColor);

        // Set Text Color CSS Variable
        if (data.textColor) {
          document.documentElement.style.setProperty('--text-color', data.textColor);
        }
      } else {
        setLoading(false);
      }
    }, (error) => {
      console.error('App: Erro ao carregar configurações:', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const glassColor = settings?.glassColor || 'rgba(255, 255, 255, 0.4)';
  const finalGlassColor = (glassColor.startsWith('#') && glassColor.length === 7) 
    ? `${glassColor}66` 
    : glassColor;

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#ece6db]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#865d39] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#865d39] font-medium animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Toaster position="top-center" richColors />
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${settings?.backgroundImage || 'https://i.ibb.co/X0vYy7L/cakes.png'}")` }}
      />
      
      {/* Glass Overlay */}
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none" 
        style={{ 
          backgroundColor: finalGlassColor,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      />

      {/* Content */}
      <div className="relative z-0 flex flex-col min-h-screen">
        {isAdmin ? (
          <Admin settings={settings} setSettings={setSettings} setIsAdmin={setIsAdmin} />
        ) : (
          <>
            <Menu settings={{ ...settings, language: 'en', currency: 'USD' }} />
            <Footer 
              primaryColor={settings?.primaryColor}
              tagTitle={settings?.tagTitle}
              tagLogo={settings?.tagLogo}
              tagUrl={settings?.tagUrl}
            />
          </>
        )}
      </div>
    </div>
  );
}
