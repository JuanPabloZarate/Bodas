'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { showToast } from '@/components/ui/toast';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Heart,
  BookOpen,
  Calendar,
  Mail,
  PenTool,
  Gift,
  User,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Web Audio Context Synthesizer Ref for ambient soundscape simulation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const navLinks = [
    { href: '/', label: 'Invitación', english: 'Invitation' },
    { href: '/portal', label: 'Pase VIP', english: 'Guest Pass' },
    { href: '/pulse', label: 'Wedding Pulse', english: 'Wedding Pulse' },
    { href: '/admin', label: 'Invitados', english: 'Admin Atelier' },
    { href: '/admin/prospects', label: 'Prospectos', english: 'Prospects' },
  ];

  const drawerSections = [
    { href: '/', label: 'Inicio', icon: <Heart className="w-4 h-4 text-primary" /> },
    { href: '/#story', label: 'Nuestra Historia', icon: <BookOpen className="w-4 h-4 text-secondary" /> },
    { href: '/#chronogram', label: 'Cronograma', icon: <Calendar className="w-4 h-4 text-secondary" /> },
    { href: '/#rsvp', label: 'RSVP', icon: <Mail className="w-4 h-4 text-primary" /> },
    { href: '/#guestbook', label: 'Deseos', icon: <PenTool className="w-4 h-4 text-secondary" /> },
    { href: '/#registry', label: 'Regalos', icon: <Gift className="w-4 h-4 text-secondary" /> },
    { href: '/portal', label: 'VIP Pass', icon: <User className="w-4 h-4 text-primary" /> },
    { href: '/pulse', label: 'Wedding Pulse', icon: <Heart className="w-4 h-4 text-secondary" /> },
    { href: '/admin', label: 'Invitados Oficiales', icon: <ShieldCheck className="w-4 h-4 text-tertiary" /> },
    { href: '/admin/prospects', label: 'Prospectos de Invitados', icon: <Sparkles className="w-4 h-4 text-secondary" /> },
  ];

  const toggleAudio = () => {
    if (!isPlayingAudio) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(196, ctx.currentTime); // G3 cello warm fundamental
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(293.66, ctx.currentTime); // D4 fifth harmonic

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.5); // Soft volume

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();

          audioCtxRef.current = ctx;
          gainNodeRef.current = gain;
        }
      } catch {
        // Fallback for mock/test environments
      }
      setIsPlayingAudio(true);
      showToast('Tuscan Strings: Adagio in G Minor playing');
    } else {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
      showToast('Ambient soundscape paused');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,37,35,0.04)] border-b border-outline-variant/30 transition-all">
        <div className="h-20 max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
          {/* Brand Crest & Monogram */}
          <Link href="/" className="flex items-center gap-space-sm group">
            <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-secondary font-headline-sm italic text-base select-none group-hover:scale-105 transition-transform">
              J&amp;P
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight group-hover:text-primary transition-colors leading-tight">
                Atelier Nuptial
              </span>
              <span className="font-label-uppercase text-[10px] text-secondary uppercase tracking-widest -mt-0.5">
                Julia &amp; Pedro • Toscana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-surface-container-low/80 rounded-xl border border-outline-variant/30">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-label-uppercase uppercase tracking-wider transition-colors',
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  )}
                >
                  {link.label} <span className="sr-only">{link.english}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Controls & Soundscape Toggle */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm">
            {/* Ambient Music Mock Player Toggle */}
            <button
              type="button"
              aria-label={isPlayingAudio ? 'Pause Tuscan Soundscape' : 'Play Tuscan Soundscape'}
              onClick={toggleAudio}
              data-testid="audio-toggle-btn"
              title={isPlayingAudio ? 'Pause Tuscan Soundscape' : 'Play Tuscan Soundscape'}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all border cursor-pointer',
                isPlayingAudio
                  ? 'bg-primary text-on-primary shadow-sm border-primary animate-pulse'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/30'
              )}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* VIP Pass Shortcut Link */}
            <Link
              href="/portal"
              className="flex items-center gap-2 pl-1 py-1 pr-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
                JP
              </div>
              <span className="font-label-uppercase text-[10px] text-on-surface hidden sm:inline uppercase">
                Juan Pablo
              </span>
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              aria-label="Open mobile navigation"
              data-testid="mobile-hamburger-btn"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors border border-outline-variant/30 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-on-background/25 backdrop-blur-sm transition-all duration-300 lg:hidden"
          data-testid="mobile-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-surface-container-low shadow-[0_16px_36px_-12px_rgba(44,37,35,0.2)] flex flex-col pt-safe pb-safe z-50 border-r border-outline-variant/40"
            data-testid="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="h-16 px-margin flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs select-none">
                  J&amp;P
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  Julia &amp; Pedro
                </span>
              </div>
              <button
                type="button"
                aria-label="Close mobile navigation"
                data-testid="close-drawer-btn"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col px-margin py-space-sm gap-1 overflow-y-auto flex-1">
              <span className="font-label-uppercase text-label-uppercase text-outline uppercase tracking-[0.18em] px-3 py-2 text-[10px]">
                Celebration Navigation
              </span>
              {drawerSections.map((sec) => (
                <Link
                  key={sec.href}
                  href={sec.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </Link>
              ))}
            </div>

            {/* Drawer Footer Inscription */}
            <div className="p-margin text-center border-t border-outline-variant/20 bg-surface/50">
              <p className="font-quote-italic text-quote-italic text-secondary text-sm">
                &ldquo;With love and joy under Tuscan skies&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
