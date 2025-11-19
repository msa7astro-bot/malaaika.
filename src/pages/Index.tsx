import { useEffect, useRef, useState } from "react";
import profileImage from "@/assets/profile-image.jpg";

interface Heart {
  left: number;
  size: number;
  delay: number;
  duration: number;
  id: string;
}

export default function HeartsPage() {
  const [start, setStart] = useState(true);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState("");
  const lettersRef = useRef<HTMLDivElement>(null);
  const urduRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const TEXT = "My mate";
  const HEARTS_COUNT = 16;

  // Lyrics with timestamps (in seconds) - adjusted to start at 28 seconds
  const lyrics = [
    { time: 28, text: "These new lovers who were once cowards have become poets" },
    { time: 32, text: "unaware of what all to do in love." },
    { time: 37, text: "The ones who never uttered are now figuring words to choose" },
    { time: 47, text: "I became poet in your love," },
    { time: 52, text: "wish to say what I have written for you" },
    { time: 58, text: "In the orchards of my heart it feels like you are the rose .." },
    { time: 63, text: "It feels like you are the rose ..." },
    { time: 67, text: "Blossoming in the air, everywhere" },
    { time: 77, text: "By the way I am your bondsman," },
    { time: 82, text: "By the way, I am your bondsman" },
    { time: 87, text: "but if you want I can become the king of your heart." },
    { time: 96, text: "How can I become the raft, for the heart that have drowned" },
    { time: 100, text: "I find myself drowning, helpless, in the boundless oceans of your eyes" },
    { time: 106, text: "How can I fight the storms when its the trait of the poet to get drown" },
    { time: 115, text: "I became poet in your love," },
    { time: 120, text: "wish to say what I have written for you" },
    { time: 126, text: "Your hands gently held my trembling hands," },
    { time: 130, text: "like how, Your hands gently held my trembling hands," },
    { time: 135, text: "The palm lines keep whispering until the sleep arrives in the eyes." },
    { time: 155, text: "😁" },
    { time: 165, text: "😊" },
    { time: 175, text: "🙃" },
    { time: 188, text: "What more is left for words to claim?" },
    { time: 193, text: "The world has spoken all the same." },
    { time: 202, text: "I am not mirza neither mir," },
    { time: 212, text: "Nor a master and that's evident" },
    { time: 216, text: "I speak no truths the world never knew," },
    { time: 223, text: "But all I've penned is my life and that's true." },
    { time: 237, text: "Such and such ... but how so," },
    { time: 242, text: "With every line I read away, whatever my heart has to say," },
    { time: 247, text: "even my eyes read what your eyes have to say," },
    { time: 251, text: "Should we run away, or should we just stay." },
    { time: 261, text: "I look for admiration in your eyes," },
    { time: 266, text: "My life seems desolate without you," },
    { time: 271, text: "I became a poet, these serenades are just for you," },
    { time: 281, text: "I became the poet, only and only for you." },
  ];

  // Play music when transitioning to second page
  useEffect(() => {
    if (!start && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Auto-play prevented:", err);
      });
    }
  }, [start]);

  // Sync lyrics with audio
  useEffect(() => {
    if (!start && audioRef.current) {
      const audio = audioRef.current;
      
      const updateLyric = () => {
        const currentTime = audio.currentTime;
        
        // Show heart after last lyric or before first lyric
        if (currentTime > lyrics[lyrics.length - 1].time || currentTime < lyrics[0].time) {
          setCurrentLyric("❤️");
          return;
        }
        
        // Find the current lyric based on time
        for (let i = lyrics.length - 1; i >= 0; i--) {
          if (currentTime >= lyrics[i].time) {
            setCurrentLyric(lyrics[i].text);
            break;
          }
        }
      };

      audio.addEventListener("timeupdate", updateLyric);
      return () => audio.removeEventListener("timeupdate", updateLyric);
    }
  }, [start]);

  // Create hearts + reveal animations
  useEffect(() => {
    if (start) return;
    const timeouts: NodeJS.Timeout[] = [];

    const arr = Array.from({ length: HEARTS_COUNT }).map(() => ({
      left: Math.random() * 100,
      size: 18 + Math.random() * 42,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 3,
      id: Math.random().toString(36).slice(2),
    }));
    setHearts(arr);

    const spans = lettersRef.current?.querySelectorAll(".letter") || [];
    spans.forEach((s, idx) => {
      s.classList.remove("show");
      const t = setTimeout(() => s.classList.add("show"), idx * 200);
      timeouts.push(t);
    });

    // Urdu text animation - starts after English text completes
    const urduDelay = TEXT.length * 200 + 300;
    const tUrdu = setTimeout(() => {
      urduRef.current?.classList.add("show");
    }, urduDelay);
    timeouts.push(tUrdu);

    return () => timeouts.forEach((id) => clearTimeout(id));
  }, [start, TEXT.length]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* START PAGE */}
      {start && (
        <div
          className="flex flex-col items-center justify-center h-screen"
          style={{
            background: "linear-gradient(135deg, hsl(330 100% 90%), hsl(270 100% 95%))",
          }}
        >
          <div 
            className="text-[120px] animate-gift-pulse cursor-pointer"
            style={{
              transformOrigin: "center",
              willChange: "transform, filter"
            }}
            onClick={() => setStart(false)}
          >
            🎁
          </div>
          <div className="mt-5 text-[34px] font-bold" style={{ color: "#d61f69" }}>
            For you
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      {!start && (
        <div
          className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(330 100% 97%), hsl(270 100% 97%))",
          }}
        >
          {/* Audio Element */}
          <audio ref={audioRef} src="/music.mp3" loop />
          
          {/* Music Control Button */}
          <button
            onClick={toggleMusic}
            className="absolute top-6 right-6 z-[10] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: "rgba(219, 39, 119, 0.9)",
              boxShadow: "0 4px 15px rgba(219, 39, 119, 0.4)",
            }}
          >
            <span className="text-2xl text-white">
              {isPlaying ? "⏸️" : "▶️"}
            </span>
          </button>

          {/* Lyrics Display Box */}
          {currentLyric && (
            <div
              className="absolute bottom-6 right-6 z-[10] px-6 py-4 rounded-2xl backdrop-blur-md transition-all duration-500 animate-fade-in"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(219, 39, 119, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
                maxWidth: "320px",
              }}
            >
              <p
                className="text-base font-medium text-center leading-relaxed"
                style={{
                  color: "#db2777",
                  textShadow: "0 2px 8px rgba(255, 255, 255, 0.8)",
                }}
              >
                {currentLyric}
              </p>
            </div>
          )}
          {/* Background Glow */}
          <div
            className="absolute z-0 blur-[40px]"
            style={{
              inset: "-10%",
              background: `
                radial-gradient(600px 400px at 10% 20%, rgba(252, 231, 243, 0.6), transparent 15%),
                radial-gradient(500px 300px at 90% 80%, rgba(237, 233, 255, 0.6), transparent 15%)
              `,
            }}
          />

          {/* Hearts Layer */}
          <div className="absolute left-0 right-0 pointer-events-none z-[1]" style={{ top: "40%", bottom: 0 }}>
            {hearts.map((h) => (
              <div
                key={h.id}
                className="absolute text-[30px] will-change-transform opacity-0 animate-float-up"
                style={{
                  left: `${h.left}%`,
                  fontSize: `${h.size}px`,
                  animationDuration: `${h.duration}s`,
                  animationDelay: `${h.delay}s`,
                  transformOrigin: "center",
                  textShadow: "0 6px 18px rgba(124, 58, 237, 0.06)",
                }}
              >
                ❤
              </div>
            ))}
          </div>

          {/* Profile Image */}
          <div 
            className="relative z-[2] mb-8 opacity-0 translate-y-5 transition-all duration-[600ms]"
            ref={(el) => {
              if (el && !start) {
                setTimeout(() => {
                  el.style.opacity = "1";
                  el.style.transform = "translateY(0)";
                }, 200);
              }
            }}
          >
            <div 
              className="relative w-32 h-32 rounded-full overflow-hidden"
              style={{
                border: "4px solid hsl(346 77% 50%)",
                boxShadow: "0 0 30px rgba(219, 39, 119, 0.5), 0 0 60px rgba(219, 39, 119, 0.3)",
              }}
            >
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Main Text */}
          <div ref={lettersRef} className="relative z-[2] flex gap-2 items-end whitespace-pre">
            {TEXT.split("").map((ch, i) => (
              <span
                key={i}
                className="letter text-[60px] md:text-[60px] sm:text-[40px] font-extrabold leading-none inline-block translate-y-5 opacity-0 transition-all duration-[500ms]"
                style={{
                  color: "hsl(346 77% 50%)",
                  transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.2, 1)",
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>

          {/* Urdu Text */}
          <div className="mt-7 z-[2]" style={{ direction: "rtl" }}>
            <div
              ref={urduRef}
              className="urdu-text font-urdu text-[40px] md:text-[40px] sm:text-[22px] font-semibold opacity-0 translate-y-8 scale-95"
              style={{
                color: "#db2777",
                transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                textShadow: "0 0 20px rgba(219, 39, 119, 0.3)",
              }}
            >
              میری ساتھی
            </div>
          </div>

          <style>{`
            .letter.show {
              transform: translateY(0);
              opacity: 1;
            }
            .urdu-text.show {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
