import React from 'react';
import { motion } from 'motion/react';

interface FooterProps {
  primaryColor?: string;
  tagTitle?: string;
  tagLogo?: string;
  tagUrl?: string;
}

export default function Footer({ 
  primaryColor = '#865d39'
}: FooterProps) {
  const activeColor = primaryColor || '#865d39';
  const fixedTagTitle = 'ALUNO(A)/MENTORADO(A)';
  const fixedTagUrl = 'https://andreiacakesusa.com/';
  const fixedTagLogo = 'https://i.ibb.co/m57K2GpB/IMG-6643.png';

  return (
    <footer className="w-full py-8 flex flex-col items-center justify-center gap-4 mt-auto">
      {/* Tag Fixa Aluno(a) / Mentorado(a) */}
      <a 
        href={fixedTagUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="mb-4 flex flex-col items-center justify-between rounded-2xl bg-[#fcf3ec] border-2 hover:opacity-95 active:scale-98 transition-all text-center w-[230px] min-h-[100px] cursor-pointer shadow-lg overflow-hidden pt-2.5 pb-2 px-2.5"
        style={{ borderColor: activeColor }}
        title="Andréia Cakes USA"
      >
        <span 
          className="text-[9px] font-extrabold tracking-[0.22em] uppercase select-none px-2 mb-1"
          style={{ color: '#BD5944' }}
        >
          {fixedTagTitle}
        </span>
        <div className="w-full flex-1 flex items-center justify-center overflow-hidden bg-[#fcf3ec]">
          <img 
            src={fixedTagLogo} 
            alt="Andréia Cakes USA" 
            className="h-[68px] max-h-[72px] w-auto max-w-[215px] object-contain transform scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
      </a>

      {/* Developed By - Easy Byz Creator with fixed color #342825 */}
      <p 
        className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase mt-1 select-none"
        style={{ color: '#342825' }}
      >
        POWERED BY
      </p>
      <a 
        href="https://easybyzcreator.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group mt-2"
        title="Easy Byz Creator"
      >
        <motion.div
          className="w-[130px] h-[158px] flex items-center justify-center"
          initial={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: '#342825',
              WebkitMaskImage: 'url(https://i.ibb.co/Kj1CTDrD/patitour-2026-04-11-T125246-010.png)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: 'url(https://i.ibb.co/Kj1CTDrD/patitour-2026-04-11-T125246-010.png)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center'
            }}
          />
        </motion.div>
      </a>
    </footer>
  );
}
