import { useEffect, useState } from "react";
import wallpaper from "@/assets/wallpaper.jpg";
import { MenuBar } from "@/components/MenuBar";
import { Dock } from "@/components/Dock";
import { Window } from "@/components/Window";
import { Widget } from "@/components/Widget";
import { ClockWidget } from "@/widgets/ClockWidget";
import { TodoWidget } from "@/widgets/TodoWidget";
import { CalendarWidget } from "@/widgets/CalendarWidget";
import { WeatherWidget } from "@/widgets/WeatherWidget";
import { AboutApp } from "@/apps/AboutApp";
import { ProjectsApp } from "@/apps/ProjectsApp";
import { SkillsApp } from "@/apps/SkillsApp";
import { ExperienceApp } from "@/apps/ExperienceApp";
import { ContactApp } from "@/apps/ContactApp";
import { MusicApp } from "@/apps/MusicApp";
import { GameApp } from "@/apps/GameApp";
import { TerminalApp } from "@/apps/TerminalApp";

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

export function Desktop() {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 overflow-hidden">
      <img
        src={wallpaper}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1280}
      />
      <div className="absolute inset-0 bg-black/30" />

      <MenuBar />

      {/* Hero greeting on desktop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className="text-3xl md:text-5xl text-white/85 italic font-light text-glow"
          style={{ fontFamily: "'Snell Roundhand', 'Brush Script MT', cursive" }}
        >
          Hello, I'm Mayank
        </h1>
      </div>

      {/* Widgets */}
      {isMobile ? (
        <div className="absolute inset-x-0 top-9 bottom-24 overflow-auto p-3 grid grid-cols-2 gap-3 content-start">
          <ClockWidget />
          <WeatherWidget />
          <div className="col-span-2"><TodoWidget /></div>
          <div className="col-span-2"><CalendarWidget /></div>
        </div>
      ) : (
        <>
          <Widget id="clock" initial={{ x: 24, y: 56 }} isMobile={false}><ClockWidget /></Widget>
          <Widget id="weather" initial={{ x: 24, y: 220 }} isMobile={false}><WeatherWidget /></Widget>
          <Widget id="todo" initial={{ x: 24, y: 400 }} isMobile={false}><TodoWidget /></Widget>
          <Widget id="calendar" initial={{ x: (typeof window !== "undefined" ? window.innerWidth : 1200) - 280, y: 56 }} isMobile={false}><CalendarWidget /></Widget>
        </>
      )}

      {/* Windows */}
      <Window id="about" isMobile={isMobile}><AboutApp /></Window>
      <Window id="projects" isMobile={isMobile}><ProjectsApp /></Window>
      <Window id="skills" isMobile={isMobile}><SkillsApp /></Window>
      <Window id="experience" isMobile={isMobile}><ExperienceApp /></Window>
      <Window id="contact" isMobile={isMobile}><ContactApp /></Window>
      <Window id="music" isMobile={isMobile}><MusicApp /></Window>
      <Window id="game" isMobile={isMobile}><GameApp /></Window>
      <Window id="terminal" isMobile={isMobile}><TerminalApp /></Window>

      <Dock isMobile={isMobile} />
    </div>
  );
}
