'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import {
  Layers,
  GraduationCap,
  Cpu,
  Rocket,
  ShieldCheck,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Sparkles,
  Sliders,
  Crown,
  Eye,
  CheckCircle2,
  Activity,
  Compass,
} from 'lucide-react';

const TOTAL_FRAMES = 240;

// The 5 celestial stations + keyframes for video playback & stationary Ultra-HD quality
export const STATIONS = [
  {
    id: 0,
    name: 'SUN CORE',
    labelAr: 'قلب النجم دايسون',
    targetFrame: 0, // Frame 1
    ultraHdKey: 'phase1', // Sun_Dyson.jfif (Ultra-HD 4K crisp)
    tag: 'STATION 01 // SOLAR CORE & DYSON STRUCTURE',
  },
  {
    id: 1,
    name: 'INFRASTRUCTURE',
    labelAr: 'كوكب البنية التحتية',
    targetFrame: 86, // Frame 87 (Circuit planet + dual moons)
    ultraHdKey: 'phase2', // System_TopDown.jfif (Ultra-HD circuit planet + 2 moons)
    tag: 'STATION 02 // PLANET 1: INFRASTRUCTURE',
  },
  {
    id: 2,
    name: 'INTERFACES & UX',
    labelAr: 'واجهات الأكاديمية',
    targetFrame: 119, // Frame 120 (Educational interactive interfaces)
    ultraHdKey: 'phase3', // Crisp holographic HUD interface frame
    tag: 'STATION 03 // PLANET 2: INTERFACES',
  },
  {
    id: 3,
    name: 'AI & BIG DATA',
    labelAr: 'الذكاء والبيانات',
    targetFrame: 169, // Frame 170 (Purple gas giant with streaming data rings)
    ultraHdKey: 'phase4', // Planet3_AI.jfif (Ultra-HD 4K purple gas giant)
    tag: 'STATION 04 // PLANET 3: AI & BIG DATA',
  },
  {
    id: 4,
    name: 'ORBITAL 90°',
    labelAr: 'الرادار المداري الشامل',
    targetFrame: 229, // Frame 230 (90° bird's-eye architectural solar system overview)
    ultraHdKey: 'phase5', // Planet1_Infra.jfif (Ultra-HD 4K 90° concentric orbits)
    tag: 'STATION 05 // 90° TOP-DOWN OVERVIEW',
  },
];

// Pristine 4K Keyframe Images for stationary crystal-clear viewing
const ULTRA_HD_KEYFRAMES: { [key: string]: string } = {
  phase1: '/Sun_Dyson.jfif',
  phase2: '/System_TopDown.jfif', // Circuit-traced planet + 2 moons + Sun
  phase3: '/frames/frame_0087.png', // Ultra-crisp holographic HUD screens
  phase4: '/Planet3_AI.jfif', // 4K Purple gas giant with streaming rings
  phase5: '/Planet1_Infra.jfif', // 4K Concentric orbit solar system diagram
};

export function ScrollytellingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Loading state
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Active Station (0 to 4)
  const [activeStation, setActiveStation] = useState(0);
  const activeStationRef = useRef(0);
  activeStationRef.current = activeStation;

  // Current Frame being drawn (0 to 239)
  const [currentFrame, setCurrentFrame] = useState(0);
  const currentFrameRef = useRef(0);
  currentFrameRef.current = currentFrame;

  // Animation lock during smooth video transition between stations
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Active hover orbit ring in Phase 5
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);

  // Cached frame images & Ultra-HD stationary keyframes
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const ultraHdImagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  // Render a specific image element to canvas with object-fit: cover math
  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const hRatio = canvasWidth / img.naturalWidth;
    const vRatio = canvasHeight / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (canvasWidth - img.naturalWidth * ratio) / 2;
    const centerShiftY = (canvasHeight - img.naturalHeight * ratio) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
      centerShiftX,
      centerShiftY,
      img.naturalWidth * ratio,
      img.naturalHeight * ratio
    );
  }, []);

  // Helper to get best available frame during transition
  const getLoadedImage = useCallback((targetIdx: number): HTMLImageElement | null => {
    const direct = imagesRef.current[targetIdx];
    if (direct && direct.complete && direct.naturalWidth > 0) {
      return direct;
    }
    // Search nearby frames
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && imagesRef.current[prev]?.complete && imagesRef.current[prev]?.naturalWidth > 0) {
        return imagesRef.current[prev];
      }
      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && imagesRef.current[next]?.complete && imagesRef.current[next]?.naturalWidth > 0) {
        return imagesRef.current[next];
      }
    }
    return null;
  }, []);

  // Draw intermediate animation frame during camera motion
  const renderFrame = useCallback((frameIndex: number) => {
    const img = getLoadedImage(frameIndex);
    if (img) {
      drawImageToCanvas(img);
    }
  }, [getLoadedImage, drawImageToCanvas]);

  // Draw stationary Ultra-HD crisp 4K keyframe image when standing at a station
  const renderStationaryKeyframe = useCallback((stationIdx: number) => {
    const st = STATIONS[stationIdx];
    if (!st) return;
    const ultraHd = ultraHdImagesRef.current[st.ultraHdKey];
    if (ultraHd && ultraHd.complete && ultraHd.naturalWidth > 0) {
      drawImageToCanvas(ultraHd);
    } else {
      renderFrame(st.targetFrame);
    }
  }, [drawImageToCanvas, renderFrame]);

  // Handle Resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    if (!isTransitioningRef.current) {
      renderStationaryKeyframe(activeStationRef.current);
    } else {
      renderFrame(currentFrameRef.current);
    }
  }, [renderStationaryKeyframe, renderFrame]);

  // 1. Preload Ultra-HD 4K Keyframes immediately + 240 animation frames
  useEffect(() => {
    let isCancelled = false;

    // A. Preload Ultra-HD 4K Keyframes First
    Object.entries(ULTRA_HD_KEYFRAMES).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!isCancelled) {
          ultraHdImagesRef.current[key] = img;
          if (key === 'phase1' && activeStationRef.current === 0) {
            renderStationaryKeyframe(0);
          }
        }
      };
    });

    // B. Preload the 240 Sequence Animation Frames for Video Scrub
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loaded = 0;

    const updateProgress = () => {
      loaded++;
      if (!isCancelled) {
        setLoadedCount(loaded);
        if (loaded === 1 && canvasRef.current) {
          renderStationaryKeyframe(0);
        }
        if (loaded >= TOTAL_FRAMES) {
          setIsPreloaded(true);
        }
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(4, '0');
      img.src = `/frames/frame_${frameNum}.png`;
      img.onload = updateProgress;
      img.onerror = () => {
        img.src = `/hercules%20img/frame_${frameNum}.png`;
        img.onload = updateProgress;
        img.onerror = updateProgress;
      };
      images[i] = img;
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [renderStationaryKeyframe]);

  // Canvas resize and initial paint
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // =========================================================================
  // CORE TRANSITION ENGINE: Smooth Video Playback Between Stations
  // =========================================================================
  const transitionToStation = useCallback((targetStationIdx: number) => {
    if (isTransitioningRef.current) return;
    if (targetStationIdx < 0) return;

    // If past Station 4, smoothly scroll down into Ecosystem Directory
    if (targetStationIdx > 4) {
      const directorySection = document.getElementById('ecosystem-directory');
      if (directorySection) {
        directorySection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const fromFrame = currentFrameRef.current;
    const toFrame = STATIONS[targetStationIdx].targetFrame;

    // Dynamic duration based on frame delta
    const frameDiff = Math.abs(toFrame - fromFrame);
    const duration = Math.min(1.0, Math.max(0.65, (frameDiff / 100) * 0.8));

    const frameTracker = { frame: fromFrame };

    gsap.to(frameTracker, {
      frame: toFrame,
      duration: duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const f = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameTracker.frame)));
        setCurrentFrame(f);
        requestAnimationFrame(() => renderFrame(f));
      },
      onComplete: () => {
        setActiveStation(targetStationIdx);
        setCurrentFrame(toFrame);
        // Cross-fade immediately into razor-sharp Ultra-HD keyframe
        renderStationaryKeyframe(targetStationIdx);
        setTimeout(() => {
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        }, 120);
      },
    });
  }, [renderFrame, renderStationaryKeyframe]);

  const goToNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    if (activeStationRef.current < 4) {
      transitionToStation(activeStationRef.current + 1);
    } else {
      const directory = document.getElementById('ecosystem-directory');
      if (directory) {
        directory.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [transitionToStation]);

  const goToPrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    if (activeStationRef.current > 0) {
      transitionToStation(activeStationRef.current - 1);
    }
  }, [transitionToStation]);

  // =========================================================================
  // GESTURE HANDLERS: One-Scroll Movement / Slight Wheel / Touch / Keyboard
  // =========================================================================
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      // If user has scrolled down into the Ecosystem Directory (window.scrollY > 40),
      // allow native page scrolling unless they scroll up at the top
      if (window.scrollY > 40) {
        if (window.scrollY <= 60 && e.deltaY < -20 && activeStationRef.current === 4) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      // Inside the solar station viewport: capture single scroll gesture!
      e.preventDefault();

      if (isTransitioningRef.current) return;

      accumulatedDelta += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);

      // Trigger threshold: a very slight movement (18px)
      if (accumulatedDelta > 18) {
        accumulatedDelta = 0;
        goToNext();
      } else if (accumulatedDelta < -18) {
        accumulatedDelta = 0;
        goToPrev();
      }
    };

    // Keyboard Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (window.scrollY <= 40) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          goToPrev();
        }
      }
    };

    // Touch Swipe Gesture for Mobile / Tablets
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (window.scrollY > 40) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (diff > 35) {
        goToNext();
      } else if (diff < -35) {
        goToPrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [goToNext, goToPrev]);

  const progressPercent = Math.round(((currentFrame + 1) / TOTAL_FRAMES) * 100);

  return (
    <div className="relative text-white select-none font-sans" dir="ltr">
      
      {/* ============================================================ */}
      {/* 1. SYNCHRONOUS PRELOADER OVERLAY WITH PROGRESS BAR           */}
      {/* ============================================================ */}
      {!isPreloaded && (
        <div className="fixed inset-0 z-50 bg-[#020408] flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-xl">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-cyan-400/30 border-t-cyan-300 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>HERCULES // 4K CINEMATIC ENGINE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-cyan-bright mb-2">
            INITIALIZING 240 SOLAR FRAMES
          </h2>
          <p className="text-xs font-mono text-cyan-200/80 mb-6 tracking-wide max-w-md">
            Caching celestial animation sequence and Ultra-HD Dyson anchors for razor-sharp playback...
          </p>

          {/* HTML5 Native Progress Bar with Glowing Accent */}
          <div className="w-full max-w-md">
            <div className="w-full h-2 bg-[#05091a] rounded-full overflow-hidden border border-cyan-500/40 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-200 transition-all duration-150 rounded-full"
                style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between w-full max-w-md text-[11px] font-mono text-gray-400">
            <span>CACHED: {loadedCount} / {TOTAL_FRAMES} FRAMES</span>
            <span className="text-cyan-300 font-bold">{Math.round((loadedCount / TOTAL_FRAMES) * 100)}%</span>
          </div>

          {/* Quick skip button once 20+ frames ready */}
          {loadedCount >= 20 && (
            <button
              onClick={() => setIsPreloaded(true)}
              className="mt-6 px-5 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2"
            >
              <span>ENTER EXPERIENCE NOW</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. FULLSCREEN FIXED VIEWPORT CANVAS (100vw, 100vh)           */}
      {/* ============================================================ */}
      <div
        id="canvas-wrapper"
        className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-[#020408] pointer-events-none"
      >
        <canvas
          id="scrolly-canvas"
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Global Cinematic Vignette & Deep Space Atmospheric Blue Ambient */}
        <div className="absolute inset-0 bg-radial-vignette opacity-35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408]/75 via-transparent to-[#020408]/45 pointer-events-none" />
      </div>

      {/* ============================================================ */}
      {/* 3. HEADS-UP DISPLAY (HUD) TOP TELEMETRY                      */}
      {/* ============================================================ */}
      <div className="fixed top-18 sm:top-20 right-3 sm:right-8 z-30 pointer-events-auto flex items-center gap-2">
        {/* Phase Navigation Shortcuts (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-[#040817]/85 border border-cyan-500/30 rounded-full px-2.5 py-1 text-[10px] font-mono backdrop-blur-md shadow-cosmic-sm">
          {STATIONS.map((st, idx) => {
            const isActive = activeStation === idx;
            return (
              <button
                key={st.id}
                onClick={() => transitionToStation(idx)}
                className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{`P${idx + 1}: ${st.name.split(' ')[0]}`}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Live Frame Counter Badge & Video Playback Status */}
        <div className="bg-[#040817]/85 border border-cyan-500/30 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-mono text-cyan-300 flex items-center gap-2 backdrop-blur-md shadow-cosmic-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${isTransitioning ? 'bg-cyan-300 animate-ping' : 'bg-emerald-400'}`} />
          <span>F: {String(currentFrame + 1).padStart(3, '0')} / 240</span>
          <span className="text-gray-600">|</span>
          <span className="text-white font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. VERTICAL CELESTIAL STATION DOCK (شريط المحطات العمودي)    */}
      {/* ============================================================ */}
      <div className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto hidden md:flex flex-col items-center gap-2 bg-[#040817]/85 border border-cyan-500/30 p-2.5 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="text-[9px] font-mono text-cyan-400 font-bold px-1 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>STATIONS</span>
        </div>

        {/* Up arrow to previous station */}
        <button
          onClick={goToPrev}
          disabled={activeStation === 0 || isTransitioning}
          title="Previous Station (Scroll Up / Arrow Up)"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            activeStation === 0 || isTransitioning
              ? 'text-gray-600 cursor-not-allowed opacity-40'
              : 'text-cyan-300 hover:bg-cyan-500/20 hover:text-white border border-white/5 active:scale-95'
          }`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* The 5 Station Dots */}
        <div className="flex flex-col gap-2.5 my-1.5">
          {STATIONS.map((station, idx) => {
            const isActive = activeStation === idx;
            return (
              <button
                key={station.id}
                onClick={() => transitionToStation(idx)}
                title={`${station.name} - ${station.labelAr}`}
                className="group relative flex items-center"
              >
                {/* Glowing Dot */}
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isActive
                      ? 'border-cyan-300 bg-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.85)] scale-110'
                      : 'border-cyan-500/30 bg-black/60 group-hover:border-cyan-400 group-hover:scale-105'
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>

                {/* Floating Tooltip Label */}
                <div className="absolute left-7 px-3 py-1.5 rounded-xl bg-[#030612]/95 border border-cyan-400/40 text-[10px] font-mono text-cyan-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-md flex items-center gap-2">
                  <span className="font-bold text-white">{`0${idx + 1}`}</span>
                  <span>{station.name}</span>
                  <span className="text-gray-400 text-[9px]">({station.labelAr})</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Down arrow to next station */}
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          title="Next Station (Scroll Down / Arrow Down)"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isTransitioning
              ? 'text-gray-600 cursor-not-allowed opacity-40'
              : 'text-cyan-300 hover:bg-cyan-500/20 hover:text-white border border-white/5 active:scale-95'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 5. CINEMATIC SCENE VIEWPORT & STATION CARDS                  */}
      {/* ============================================================ */}
      <div className="relative w-full h-screen overflow-hidden z-20">

        {/* ========================================================== */}
        {/* STATION 0: Sun Core & Brand Intro - WELDED DYSON REACTOR  */}
        {/* ملحوم بالكامل مع شكل الشمس وهيكل دايسون في الخلفية          */}
        {/* ========================================================== */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-all duration-700 ${
            activeStation === 0 ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-90'
          }`}
        >
          {/* Circular Cybernetic Dyson Reactor Hub */}
          <div className="relative flex items-center justify-center">
            
            {/* Concentric Rotating Outer Mechanical Dyson Ring Orbits */}
            <div className="absolute w-[310px] h-[310px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] rounded-full border border-amber-400/30 border-dashed animate-spin-slow pointer-events-none" />
            <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[450px] md:h-[450px] rounded-full border border-cyan-400/25 pointer-events-none" />
            <div className="absolute w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[410px] md:h-[410px] rounded-full border-2 border-amber-500/30 border-dotted pointer-events-none" />

            {/* Fiery Solar Corona Glow that blends into the background sun */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-cyan-500/15 blur-3xl pointer-events-none" />

            {/* Welded Reactor Core Aperture (Circular & Translucent) */}
            <div className="relative w-[290px] h-[290px] sm:w-[370px] sm:h-[370px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-[#0c1838]/70 via-[#060c20]/80 to-[#02050c]/90 border-2 border-amber-400/60 p-6 sm:p-8 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-[0_0_70px_rgba(245,158,11,0.45),inset_0_0_40px_rgba(245,158,11,0.25)]">
              
              {/* Solar Crown Icon */}
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mb-1.5 shadow-cosmic-sm">
                <Crown className="w-4 h-4" />
              </div>

              {/* Brand Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-mono text-cyan-bright tracking-widest drop-shadow-[0_0_25px_rgba(56,189,248,0.8)]">
                HERCULES
              </h1>

              {/* Tagline */}
              <p className="text-[10px] sm:text-xs font-bold text-amber-300 font-mono tracking-wider mt-0.5 mb-1.5">
                [ مـنـظـومـة هِـرَقْـل الـكـونـيـة // 2026 ]
              </p>

              {/* Concise Description */}
              <p className="text-[10px] sm:text-xs text-blue-100 max-w-[230px] sm:max-w-xs leading-relaxed font-sans mb-3 sm:mb-4">
                المنظومة الرقمية الشاملة للأصول، التعليم، الذكاء الاصطناعي، وإطلاق المشاريع.
              </p>

              {/* Action Button that looks like a reactor ignition trigger */}
              <button
                onClick={() => transitionToStation(1)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-blue-600 text-black font-black text-[11px] sm:text-xs font-mono transition-all hover:scale-105 shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center gap-1.5 group"
              >
                <span>انـطـلـق إلـى الـكـواكـب</span>
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Gesture Hint */}
              <span className="text-[8px] sm:text-[9px] font-mono text-cyan-300/80 mt-1.5">
                ↓ سكرول واحد خفيف أو سهم الكيبورد
              </span>
            </div>

          </div>
        </div>

        {/* ========================================================== */}
        {/* STATION 1: Planet 1 – Speed & Infrastructure               */}
        {/* متجاوب تماماً للهاتف: مثبت بالأسفل بالهاتف وباليسار بالديسكتوب */}
        {/* ========================================================== */}
        <div
          className={`absolute transition-all duration-500 inset-x-3 bottom-6 sm:bottom-10 md:inset-auto md:left-[8vw] md:top-[55vh] max-w-sm sm:max-w-md mx-auto md:mx-0 ${
            activeStation === 1
              ? 'opacity-100 pointer-events-auto translate-y-0'
              : 'opacity-0 pointer-events-none translate-y-6'
          }`}
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-[#040817]/90 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.25)] corner-bracket pointer-events-auto">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>STATION 02 // PLANET 1: INFRASTRUCTURE</span>
              </span>
              <span className="bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/20">F: 087 / 240</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white font-mono flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Core Infrastructure & Web</span>
            </h3>

            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-sans">
              Circuit-traced terrestrial planet anchored with dual orbital moons for distributed edge compute and instant asset licensing.
            </p>

            {/* Performance Metrics: Latency < 20ms, 99.99% Uptime */}
            <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-black/50 border border-white/[0.08] text-xs font-mono">
              <div>
                <span className="text-gray-400 text-[10px] block">GLOBAL LATENCY</span>
                <span className="text-cyan-300 font-bold">&lt; 20ms Edge</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">SYSTEM UPTIME</span>
                <span className="text-emerald-400 font-bold">99.99% Verified</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono text-cyan-400/70">
                Anchor: Planet1_Infra
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => transitionToStation(2)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>التالي (Next)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/market"
                  className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-mono flex items-center gap-1"
                >
                  <span>Market</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* STATION 2: Planet 2 – Interface & UX                       */}
        {/* ========================================================== */}
        <div
          className={`absolute transition-all duration-500 inset-x-3 bottom-6 sm:bottom-10 md:inset-auto md:right-[8vw] md:top-[35vh] max-w-sm sm:max-w-md mx-auto md:mx-0 ${
            activeStation === 2
              ? 'opacity-100 pointer-events-auto translate-x-0'
              : 'opacity-0 pointer-events-none translate-x-8'
          }`}
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-[#040817]/90 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(59,130,246,0.25)] corner-bracket pointer-events-auto">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                <span>STATION 03 // PLANET 2: INTERFACES</span>
              </span>
              <span className="bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/20">F: 120 / 240</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white font-mono flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span>Intelligent Interfaces & Experience</span>
            </h3>

            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-sans">
              Interactive learning environments, applied sandbox evaluation, and verifiable cryptographic credentials.
            </p>

            {/* Interactive Sub-Badges */}
            <div className="space-y-1.5 my-3 text-xs font-mono text-gray-300">
              <div className="p-2 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between hover:border-cyan-400/40 transition-colors">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>VERIFIED CERTIFICATIONS (QR-AUTH)</span>
                </div>
                <span className="text-[10px] text-emerald-400">ACTIVE</span>
              </div>

              <div className="p-2 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between hover:border-cyan-400/40 transition-colors">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>INTERACTIVE CODE RUNNER & QUIZ</span>
                </div>
                <span className="text-[10px] text-cyan-300">LIVE</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono text-cyan-400/70">
                Anchor: Hercules Academy
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => transitionToStation(3)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>التالي (Next)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/academy"
                  className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-mono flex items-center gap-1"
                >
                  <span>Academy</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* STATION 3: Planet 3 – AI & Automation                      */}
        {/* ========================================================== */}
        <div
          className={`absolute transition-all duration-500 inset-x-3 bottom-6 sm:bottom-10 md:inset-auto md:left-1/2 md:top-[60vh] max-w-sm sm:max-w-xl mx-auto md:-translate-x-1/2 ${
            activeStation === 3
              ? 'opacity-100 pointer-events-auto translate-y-0'
              : 'opacity-0 pointer-events-none translate-y-8'
          }`}
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-[#040817]/90 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)] corner-bracket pointer-events-auto text-center">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                <span>STATION 04 // PLANET 3: AI & BIG DATA</span>
              </span>
              <span className="bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/20">F: 170 / 240</span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white font-mono flex items-center justify-center gap-2">
              <Cpu className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-400" />
              <span>Autonomous Systems & Big Data</span>
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed max-w-md mx-auto font-sans">
              Purple gas giant with streaming data rings housing 40+ indexed machine intelligence models with live side-by-side benchmarking and interactive sandbox synthesis.
            </p>

            {/* Orbital Ring Metrics */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 my-3 text-xs font-mono">
              <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] sm:text-[10px] text-gray-400 block">AI MODELS</span>
                <span className="text-cyan-300 font-bold text-[11px] sm:text-xs">40+ INDEXED</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] sm:text-[10px] text-gray-400 block">COMPARISON</span>
                <span className="text-cyan-300 font-bold text-[11px] sm:text-xs">SIDE-BY-SIDE</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] sm:text-[10px] text-gray-400 block">SANDBOX</span>
                <span className="text-emerald-400 font-bold text-[11px] sm:text-xs">REALTIME</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono text-cyan-400/70">
                Anchor: Planet3_AI
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => transitionToStation(4)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl cosmic-btn-primary text-xs font-bold flex items-center gap-1.5"
                >
                  <span>النظرة الشاملة (Radar)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/ai"
                  className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-mono flex items-center gap-1"
                >
                  <span>AI Hub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* STATION 4: Grand Top-Down Concentric Radar Overview        */}
        {/* ========================================================== */}
        <div
          className={`absolute inset-0 flex items-center justify-center p-3 sm:p-4 transition-all duration-500 ${
            activeStation === 4
              ? 'opacity-100 pointer-events-auto scale-100'
              : 'opacity-0 pointer-events-none scale-95'
          }`}
        >
          {/* Interactive Concentric SVG Overlays aligned over System_TopDown */}
          <div className="relative w-full max-w-4xl aspect-square max-h-[85vh] flex items-center justify-center pointer-events-auto">
            
            {/* SVG Orbit Radar Concentric Rings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto" viewBox="0 0 800 800">
              {/* Orbit Ring 1: Market (Inner - r=135) */}
              <circle
                cx="400"
                cy="400"
                r="135"
                fill="none"
                stroke={hoveredRing === 1 ? '#38BDF8' : 'rgba(56, 189, 248, 0.3)'}
                strokeWidth={hoveredRing === 1 ? '4' : '1.5'}
                strokeDasharray={hoveredRing === 1 ? '8 4' : '4 4'}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRing(1)}
              />

              {/* Orbit Ring 2: Academy (r=205) */}
              <circle
                cx="400"
                cy="400"
                r="205"
                fill="none"
                stroke={hoveredRing === 2 ? '#38BDF8' : 'rgba(56, 189, 248, 0.25)'}
                strokeWidth={hoveredRing === 2 ? '4' : '1.5'}
                strokeDasharray={hoveredRing === 2 ? '8 4' : '6 6'}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRing(2)}
              />

              {/* Orbit Ring 3: AI Hub (r=280) */}
              <circle
                cx="400"
                cy="400"
                r="280"
                fill="none"
                stroke={hoveredRing === 3 ? '#38BDF8' : 'rgba(56, 189, 248, 0.22)'}
                strokeWidth={hoveredRing === 3 ? '4' : '1.5'}
                strokeDasharray={hoveredRing === 3 ? '10 5' : '8 8'}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRing(3)}
              />

              {/* Orbit Ring 4: Launchpad (Outer - r=355) */}
              <circle
                cx="400"
                cy="400"
                r="355"
                fill="none"
                stroke={hoveredRing === 4 ? '#38BDF8' : 'rgba(56, 189, 248, 0.18)'}
                strokeWidth={hoveredRing === 4 ? '4' : '1.5'}
                strokeDasharray={hoveredRing === 4 ? '12 6' : '10 10'}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRing(4)}
              />
            </svg>

            {/* Central Sun Dyson Core Node */}
            <div className="absolute z-30 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#040817]/85 border-2 border-cyan-400 p-2 sm:p-3 flex flex-col items-center justify-center text-center backdrop-blur-xl shadow-[0_0_50px_rgba(56,189,248,0.5)]">
              <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 mb-0.5" />
              <span className="font-mono font-black text-[10px] sm:text-xs text-cyan-bright">HERCULES</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-cyan-300/80">DYSON CORE</span>
              <Link
                href="/admin"
                className="mt-1 px-1.5 sm:px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 text-[8px] sm:text-[9px] font-mono hover:bg-cyan-500 hover:text-black transition-all"
              >
                ADMIN
              </Link>
            </div>

            {/* Top-Down Interactive System Panel Overlay */}
            <div className="absolute bottom-2 inset-x-2 sm:inset-x-8 max-w-xl mx-auto p-3.5 sm:p-4 rounded-2xl bg-[#030612]/92 border border-cyan-400/40 backdrop-blur-2xl shadow-2xl text-center corner-bracket">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                <span>STATION 05 // 90° TOP-DOWN OVERVIEW</span>
                <span>ANCHOR: System_TopDown</span>
              </div>

              <h4 className="text-xs sm:text-base font-bold font-mono text-white">
                {hoveredRing === 1
                  ? '🪐 RING 01: HERCULES DIGITAL MARKET'
                  : hoveredRing === 2
                  ? '🪐 RING 02: HERCULES ACADEMY & CERTIFICATES'
                  : hoveredRing === 3
                  ? '🪐 RING 03: HERCULES AI MATRIX & SANDBOX'
                  : hoveredRing === 4
                  ? '🪐 RING 04: HERCULES LAUNCHPAD (PRODUCT HUNT)'
                  : 'HOVER OR CLICK ANY CONCENTRIC RING TO INSPECT'}
              </h4>

              <p className="text-[11px] sm:text-xs text-gray-300 mt-1 line-clamp-1 font-sans">
                {hoveredRing === 1
                  ? 'Buy & sell digital assets: Next.js templates, PSD/AE/Premiere, Notion, and 3D models.'
                  : hoveredRing === 2
                  ? 'Accredited tracks, interactive quizzes, and verifiable QR code certifications.'
                  : hoveredRing === 3
                  ? 'Benchmark 40+ LLMs and synthesize code and copywriting in the live sandbox.'
                  : hoveredRing === 4
                  ? 'Launch tech startups, gain initial 1,000 users, and partner with co-founders.'
                  : 'The complete 4-tier solar ecosystem running on synchronous 240-frame timeline.'}
              </p>

              {/* Action Buttons for the 4 Domains as CTAs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/[0.08] text-[11px] sm:text-xs font-mono">
                <Link
                  href="/market"
                  onMouseEnter={() => setHoveredRing(1)}
                  className={`p-1.5 sm:p-2 rounded-xl border transition-all text-center ${
                    hoveredRing === 1
                      ? 'bg-cyan-400 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-black/40 border-white/10 text-cyan-300 hover:text-white'
                  }`}
                >
                  01 // MARKET
                </Link>
                <Link
                  href="/academy"
                  onMouseEnter={() => setHoveredRing(2)}
                  className={`p-1.5 sm:p-2 rounded-xl border transition-all text-center ${
                    hoveredRing === 2
                      ? 'bg-cyan-400 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-black/40 border-white/10 text-cyan-300 hover:text-white'
                  }`}
                >
                  02 // ACADEMY
                </Link>
                <Link
                  href="/ai"
                  onMouseEnter={() => setHoveredRing(3)}
                  className={`p-1.5 sm:p-2 rounded-xl border transition-all text-center ${
                    hoveredRing === 3
                      ? 'bg-cyan-400 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-black/40 border-white/10 text-cyan-300 hover:text-white'
                  }`}
                >
                  03 // AI MATRIX
                </Link>
                <Link
                  href="/launchpad"
                  onMouseEnter={() => setHoveredRing(4)}
                  className={`p-1.5 sm:p-2 rounded-xl border transition-all text-center ${
                    hoveredRing === 4
                      ? 'bg-cyan-400 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-black/40 border-white/10 text-cyan-300 hover:text-white'
                  }`}
                >
                  04 // LAUNCHPAD
                </Link>
              </div>

              {/* Scroll down into Directory Prompt */}
              <div className="mt-2.5 pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    const dir = document.getElementById('ecosystem-directory');
                    if (dir) dir.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[10px] sm:text-[11px] font-mono text-cyan-300 hover:text-white flex items-center gap-1 font-bold underline underline-offset-4"
                >
                  <span>استكشف دليل المنظومة الشامل بالأسفل ↓</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
