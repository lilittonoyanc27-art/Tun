import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Calendar,
  Sparkles,
  Hash,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Volume2,
  VolumeX,
  Award,
  BookOpen,
  Hammer,
  RotateCcw,
  Check,
  X,
  ChevronRight,
  Home,
  Flame,
  Info,
  GraduationCap
} from "lucide-react";
import { questionsList, vocabularyList, QUIZ_CATEGORIES, Question, VocabularyWord } from "./quizData";
import { IsometricScene } from "./isometricAssets";

// Browser synthesized Audio FX player
const playSynthSound = (type: "correct" | "incorrect" | "build" | "victory") => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === "correct") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.value = 523.25; // C5
      osc2.frequency.value = 659.25; // E5
      osc1.type = "sine";
      osc2.type = "sine";
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } else if (type === "incorrect") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 160; 
      osc.type = "sawtooth";
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "build") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "victory") {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = "sine";
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + idx * 0.08 + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    }
  } catch (error) {
    console.warn("AudioContext block", error);
  }
};

// Text-to-Speech in Spanish to teach correct pronunciation
const speakSpanishText = (word: string) => {
  if (!window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "es-ES";
    const voices = window.speechSynthesis.getVoices();
    const cleanSpanishVoice = voices.find(v => v.lang.startsWith("es-") || v.lang.startsWith("es_"));
    if (cleanSpanishVoice) {
      utterance.voice = cleanSpanishVoice;
    }
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error("SpeechSynthesis error", e);
  }
};

export default function App() {
  // Navigation / Tabs state
  // "campaign" = Core building campaign, "practice" = Unlimited quiz play, "dictionary" = Armenian-Spanish vocabulary cards
  const [activeTab, setActiveTab] = useState<"campaign" | "practice" | "dictionary">("campaign");

  // App Theme/Weather configurations
  const [weather, setWeather] = useState<"sunny" | "night" | "rainy" | "snowy">("sunny");
  
  // Game metrics
  const [coins, setCoins] = useState(() => {
    return Number(localStorage.getItem("cottage_coins") || "0");
  });
  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem("cottage_streak") || "0");
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Campaign State
  const [campaignActive, setCampaignActive] = useState(false);
  const [campaignStep, setCampaignStep] = useState(0); // 0 to 12
  const [campaignQuestions, setCampaignQuestions] = useState<Question[]>([]);
  const [campaignIdx, setCampaignIdx] = useState(0);
  const [selectedCampaignAnswer, setSelectedCampaignAnswer] = useState<string | null>(null);
  const [campaignAnswerIsCorrect, setCampaignAnswerIsCorrect] = useState<boolean | null>(null);
  const [campaignCompleted, setCampaignCompleted] = useState(false);

  // Practice State
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<string | null>(null);
  const [practiceQuestion, setPracticeQuestion] = useState<Question | null>(null);
  const [selectedPracticeAnswer, setSelectedPracticeAnswer] = useState<string | null>(null);
  const [practiceAnswerIsCorrect, setPracticeAnswerIsCorrect] = useState<boolean | null>(null);
  const [practiceCorrectCount, setPracticeCorrectCount] = useState(0);

  // Dict state
  const [dictSearch, setDictSearch] = useState("");
  const [dictFilter, setDictFilter] = useState<string>("all");

  // Sparkly particle animations overlay when building gets added
  const [sparkleActive, setSparkleActive] = useState(false);
  const [placedItemName, setPlacedItemName] = useState("");

  // Persists scores to localStorage
  useEffect(() => {
    localStorage.setItem("cottage_coins", coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("cottage_streak", streak.toString());
  }, [streak]);

  // Load a set of voices on start so speech synthesis gets cached
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Set up campaign questions (select 3 random questions from each of the 4 categories)
  const initializeCampaign = () => {
    const categories: ("time" | "days" | "gender" | "numbers")[] = ["time", "days", "gender", "numbers"];
    let selected: Question[] = [];
    
    categories.forEach(cat => {
      const filtered = questionsList.filter(q => q.category === cat);
      // Shuffle filtered and pick 3
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      selected = [...selected, ...shuffled.slice(0, 3)];
    });

    // Shuffle the final 12 questions so they are randomized in sequence
    const finalChain = selected.sort(() => 0.5 - Math.random());
    // Shuffle the option positions for each question so correct answer isn't always first
    const randomizedOptionsChain = finalChain.map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));
    setCampaignQuestions(randomizedOptionsChain);
    
    // Reset indicators
    setCampaignStep(0);
    setCampaignIdx(0);
    setSelectedCampaignAnswer(null);
    setCampaignAnswerIsCorrect(null);
    setCampaignActive(true);
    setCampaignCompleted(false);

    if (soundEnabled) playSynthSound("build");
  };

  // Build construction logs descriptions based on step number in Armenian
  const getBuildDescription = (step: number) => {
    switch (step) {
      case 0: return "Բնական կանաչապատ բացատ։ Կառուցումը պատրաստ է սկսվելու։";
      case 1: return "Փուլ 1. Գետնին ամրացվում է սալիկապատ ամուր հիմքը (Foundation)։";
      case 2: return "Փուլ 2. Ստեղծվում է սալարկված արահետ դեպի տուն (Stone Pathway)։";
      case 3: return "Փուլ 3. Կառուցվում է քարե բուխարու հիմքը և ներքին պատը (Fireplace)։";
      case 4: return "Փուլ 4. Տեղադրվում է ձախակողմյան փայտյա լոգ-պատը (Left Cabin Wall)։";
      case 5: return "Փուլ 5. Կանգնեցվում է աջակողմյան պատը՝ դռան բացվածքով (Front Wall)։";
      case 6: return "Փուլ 6. Տեղադրվում է կաղնե ամուր դուռը՝ պղնձե բռնակով (Entrance Door)։";
      case 7: return "Փուլ 7. Տեղադրվում են ապակեպատ լուսամուտները (Glass Windows)։";
      case 8: return "Փուլ 8. Կառուցվում են տան հետևի պատերն ու առաստաղի հեծանները (Rear Walls)։";
      case 9: return "Փուլ 9. Սալիկապատվում է տանիքի ձախ լանջը կավե կարմիր կղմինդրով (Slate Roof Left)։";
      case 10: return "Փուլ 10. Ավարտվում է տանիքի աջ լանջի սալիկապատումը (Roof Completed)։";
      case 11: return "Փուլ 11. Տեղադրվում է ծխնելույզը, և տաք ծուխն է բարձրանում (Chimney smoke)։";
      case 12: return "Փուլ 12. Տունը լուսավորվում է, հայտնվում է գառնուկն ու ծաղիկները (Cozy Glow)։";
      default: return "";
    }
  };

  const getBuildShortName = (step: number) => {
    switch (step) {
      case 1: return "Քարե հիմք";
      case 2: return "Արահետ";
      case 3: return "Բուխարի";
      case 4: return "Ձախ պատ";
      case 5: return "Աջ պատ";
      case 6: return "Կաղնե Դուռ";
      case 7: return "Ապակեպատ լուսամուտ";
      case 8: return "Հետևի պատեր";
      case 9: return "Տանիքի 1-ին մաս";
      case 10: return "Տանիքի 2-րդ մաս";
      case 11: return "Ծխնելույզ և ծուխ";
      case 12: return "Ոսկե գույնի կանթեղներ ու գառնուկ";
      default: return "";
    }
  };

  const handleCampaignAnswer = (option: string) => {
    if (selectedCampaignAnswer !== null) return; // Prevent double taps

    const currentQue = campaignQuestions[campaignIdx];
    setSelectedCampaignAnswer(option);

    const isCorrect = option === currentQue.correctAnswer;
    setCampaignAnswerIsCorrect(isCorrect);

    if (isCorrect) {
      const nextStepIndex = campaignStep + 1;
      setCampaignStep(nextStepIndex);
      setCoins(prev => prev + 15);
      setStreak(prev => prev + 1);
      setPlacedItemName(getBuildShortName(nextStepIndex));
      setSparkleActive(true);
      setTimeout(() => setSparkleActive(false), 3000);

      // Play correction sound & carpenter mallet building impact sound
      if (soundEnabled) {
        playSynthSound("correct");
        setTimeout(() => playSynthSound("build"), 500);
      }
    } else {
      setStreak(0); // break streak
      if (soundEnabled) {
        playSynthSound("incorrect");
      }
    }

    // Auto voice Spanish phrase
    speakSpanishText(currentQue.spanishAudioText);
  };

  const advanceCampaign = () => {
    setSelectedCampaignAnswer(null);
    setCampaignAnswerIsCorrect(null);

    const nextIdx = campaignIdx + 1;
    if (nextIdx >= campaignQuestions.length) {
      // Completed all 12 questions!
      setCampaignCompleted(true);
      setCampaignActive(false);
      setCoins(prev => prev + 100); // bonus finish coin reward
      if (soundEnabled) {
        playSynthSound("victory");
      }
    } else {
      setCampaignIdx(nextIdx);
    }
  };

  // Practice Modes logic
  const startPracticeCategory = (catId: string) => {
    setSelectedPracticeCategory(catId);
    setPracticeAnswerIsCorrect(null);
    setSelectedPracticeAnswer(null);
    
    // Choose a random question from selected category
    const catQuestions = questionsList.filter(q => q.category === catId);
    const randQ = catQuestions[Math.floor(Math.random() * catQuestions.length)];
    if (randQ) {
      // Shuffle options for the random question so the correct answer isn't always first
      const randomizedOptionsQ = {
        ...randQ,
        options: [...randQ.options].sort(() => 0.5 - Math.random())
      };
      setPracticeQuestion(randomizedOptionsQ);
    } else {
      setPracticeQuestion(null);
    }
  };

  const handlePracticeAnswer = (option: string) => {
    if (!practiceQuestion || selectedPracticeAnswer !== null) return;
    
    setSelectedPracticeAnswer(option);
    const isCorrect = option === practiceQuestion.correctAnswer;
    setPracticeAnswerIsCorrect(isCorrect);

    if (isCorrect) {
      setCoins(prev => prev + 10);
      setStreak(prev => prev + 1);
      setPracticeCorrectCount(prev => prev + 1);
      if (soundEnabled) playSynthSound("correct");
    } else {
      setStreak(0);
      if (soundEnabled) playSynthSound("incorrect");
    }

    speakSpanishText(practiceQuestion.spanishAudioText);
  };

  const nextPracticeQuestion = () => {
    if (selectedPracticeCategory) {
      startPracticeCategory(selectedPracticeCategory);
    }
  };

  // Filter dictionary based on search term & category tab selection
  const filteredVocabulary = vocabularyList.filter(item => {
    const matchesSearch =
      item.spanish.toLowerCase().includes(dictSearch.toLowerCase()) ||
      item.armenian.toLowerCase().includes(dictSearch.toLowerCase());
    
    const matchesCategory =
      dictFilter === "all" || item.category === dictFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#111c14] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-900 pb-12">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="sticky top-0 z-50 bg-[#16271c]/90 backdrop-blur-md border-b border-emerald-900/40 shadow-xl px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950 rounded-2xl border border-emerald-500/30 shadow-md">
              <Home className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Փայտե Տնակ 🏡 Իսպաներենի Ուսուցում
              </h1>
              <p className="text-xs text-emerald-400">
                Սովորիր իսպաներեն և կառուցիր քո երազանքների քոթեջը բնության գրկում
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-4">
            
            {/* Coin balance panel */}
            <div className="flex items-center gap-2 bg-[#09150e] px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-inner">
              <span className="text-lg">🪙</span>
              <span className="text-sm font-mono font-bold text-amber-300">{coins}</span>
              <span className="text-[10px] text-amber-400/70 font-semibold">Միավոր</span>
            </div>

            {/* Streak Counter panel */}
            <div className="flex items-center gap-1.5 bg-[#09150e] px-3.5 py-1.5 rounded-full border border-orange-500/30 shadow-inner">
              <Flame className={`w-4.5 h-4.5 text-orange-500 ${streak > 0 ? 'animate-bounce' : ''}`} />
              <span className="text-sm font-mono font-bold text-orange-400">{streak}</span>
              <span className="text-[10px] text-orange-400/70 font-semibold">Օրակարգ</span>
            </div>

            {/* Sound toggle button */}
            <button
              id="sound-mute-btn"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) {
                  // Test sound on activation
                  setTimeout(() => playSynthSound("correct"), 100);
                }
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/50 hover:bg-slate-800 hover:text-emerald-400 transition"
              title={soundEnabled ? "Անջատել ձայնը" : "Միացնել ձայնը"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Main view choice tabs */}
            <div className="flex p-1 bg-[#09150e] rounded-xl border border-emerald-900/30">
              <button
                id="tab-campaign"
                onClick={() => {
                  setActiveTab("campaign");
                  if (soundEnabled) playSynthSound("build");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeTab === "campaign"
                    ? "bg-emerald-800 text-slate-100 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                Ճամփորդություն
              </button>
              <button
                id="tab-practice"
                onClick={() => {
                  setActiveTab("practice");
                  if (soundEnabled) playSynthSound("build");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeTab === "practice"
                    ? "bg-emerald-800 text-slate-100 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Մարզում
              </button>
              <button
                id="tab-dictionary"
                onClick={() => {
                  setActiveTab("dictionary");
                  if (soundEnabled) playSynthSound("build");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeTab === "dictionary"
                    ? "bg-emerald-800 text-slate-100 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Բառարան
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN GAME CONTAINER                        */}
      {/* ========================================== */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 3D INTERACTIVE BUILD VIEW (5 COLS SPAN) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Headline of building area */}
          <div className="bg-[#16271c] border border-emerald-900/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400 animate-pulse" />
                Իսպանական Քոթեջ
              </h2>
              <p className="text-xs text-slate-400">
                Անցիր թեմաները, որպեսզի տեսնես քո աշխատանքի պտուղները
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-xs block text-slate-500 font-mono">ԿԱՌՈՒՑՎԱԾ Է</span>
              <span className="text-md font-mono font-extrabold text-emerald-400">
                {Math.round((campaignStep / 12) * 100)}%
              </span>
            </div>
          </div>

          {/* Interactive Isometric SVG Scene */}
          <IsometricScene progressStep={campaignStep} weather={weather} />

          {/* Particle Burst notifications overlay */}
          <AnimatePresence>
            {sparkleActive && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.8 }}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-4 py-3 rounded-2xl text-xs font-bold text-center shadow-xl border border-yellow-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-900 animate-spin" />
                <div>
                  <span className="block font-extrabold">ՆՈՐ ՄԱՍՆԻԿ ՏԵՂԱԴՐՎԵՑ 🛠️</span>
                  <span>«{placedItemName}»-ն ավելացավ քո տնակին!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background controller: Weather state switcher */}
          <div className="bg-[#122017] border border-emerald-950 rounded-2xl p-4 shadow-md">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3 text-center">
              🌤️ ՓՈԽԵԼ ԵՂԱՆԱԿԸ / ԱԿՏԻՎ ԱՏՄՈՍՖԵՐԱՆ
            </h3>
            
            <div className="grid grid-cols-4 gap-2">
              <button
                id="weather-sunny"
                onClick={() => {
                  setWeather("sunny");
                  if (soundEnabled) playSynthSound("build");
                }}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  weather === "sunny"
                    ? "bg-amber-500 text-slate-900 font-bold scale-105 shadow-md"
                    : "bg-[#09150e] hover:bg-[#16271c] text-amber-300 text-xs"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-[10px]">Արևոտ</span>
              </button>

              <button
                id="weather-night"
                onClick={() => {
                  setWeather("night");
                  if (soundEnabled) playSynthSound("build");
                }}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  weather === "night"
                    ? "bg-indigo-600 text-slate-100 font-bold scale-105 shadow-md"
                    : "bg-[#09150e] hover:bg-[#16271c] text-indigo-400 text-xs"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-[10px]">Գիշեր</span>
              </button>

              <button
                id="weather-rainy"
                onClick={() => {
                  setWeather("rainy");
                  if (soundEnabled) playSynthSound("build");
                }}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  weather === "rainy"
                    ? "bg-slate-600 text-slate-100 font-bold scale-105 shadow-md"
                    : "bg-[#09150e] hover:bg-[#16271c] text-slate-400 text-xs"
                }`}
              >
                <CloudRain className="w-4 h-4" />
                <span className="text-[10px]">Անձրև</span>
              </button>

              <button
                id="weather-snowy"
                onClick={() => {
                  setWeather("snowy");
                  if (soundEnabled) playSynthSound("build");
                }}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  weather === "snowy"
                    ? "bg-slate-100 text-slate-900 font-bold scale-105 shadow-md"
                    : "bg-[#09150e] hover:bg-[#16271c] text-slate-400 text-xs"
                }`}
              >
                <Snowflake className="w-4 h-4" />
                <span className="text-[10px]">Ձյուն</span>
              </button>
            </div>
            
            {/* Live log detailing the structural phase */}
            <div className="mt-4 p-3 bg-[#0a110d] rounded-xl border border-emerald-950/60">
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest block mb-1">
                📐 Շինարարական Լոգ
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {getBuildDescription(campaignStep)}
              </p>
            </div>

          </div>

        </section>

        {/* RIGHT COLUMN: INTERACTIVE QUIZ & CONSOLE PANEL (7 COLS SPAN) */}
        <section className="lg:col-span-7 bg-[#16271c] border border-emerald-900/30 rounded-3xl p-6 shadow-xl relative min-h-[480px]">
          
          {/* ========================================== */}
          {/* TAB 1: STORY/BUILDING CAMPAIGN             */}
          {/* ========================================== */}
          {activeTab === "campaign" && (
            <div>
              {!campaignActive && !campaignCompleted && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  
                  <div className="w-20 h-20 bg-emerald-950 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500/40 shadow-xl">
                    <Home className="w-10 h-10 text-emerald-400" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-100 mb-3">
                    Բարի գալուստ «Ճամփորդություն» փուլ
                  </h3>
                  
                  <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-6">
                    Այս ռեժիմում դուք պետք է պատասխանեք <strong>12 հատուկ ընտրված հարցերի</strong> իսպաներենի բոլոր 4 կարևոր թեմաներից:
                    Յուրաքանչյուր ճիշտ պատասխանը տեղում ավելացնելու է քոթեջի նոր մասնիկը։
                  </p>

                  <div className="grid grid-cols-2 gap-3 max-w-sm w-full mb-8">
                    <div className="bg-[#09150e] p-3 rounded-xl border border-emerald-900/40">
                      <span className="block text-md font-mono font-bold text-emerald-400">12 Փուլ</span>
                      <span className="text-[10px] text-slate-400">Շինարարության քայլեր</span>
                    </div>

                    <div className="bg-[#09150e] p-3 rounded-xl border border-emerald-900/40">
                      <span className="block text-md font-mono font-bold text-emerald-400">4 Թեմա</span>
                      <span className="text-[10px] text-slate-400">Ժամանակ, Օրեր, Սեռ, Թվեր</span>
                    </div>
                  </div>

                  <button
                    id="start-campaign-btn"
                    onClick={initializeCampaign}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 rounded-2xl font-bold tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2 group cursor-pointer"
                  >
                    <Hammer className="w-5 h-5 text-slate-900 group-hover:rotate-12 transition-transform" />
                    Սկսել Կառուցումը
                  </button>

                </div>
              )}

              {campaignActive && !campaignCompleted && (
                <div>
                  
                  {/* Campaign Question upper status row */}
                  <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4 mb-6">
                    <div>
                      <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest block">
                        Ճամփորդության ընթացքը
                      </span>
                      <span className="text-sm font-semibold text-slate-300">
                        Հարց {campaignIdx + 1} / 12 ({QUIZ_CATEGORIES.find(c => c.id === campaignQuestions[campaignIdx]?.category)?.name})
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {campaignQuestions.map((_, qIdx) => (
                        <div
                          key={qIdx}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            qIdx < campaignIdx
                              ? "bg-emerald-500"
                              : qIdx === campaignIdx
                              ? "bg-emerald-400 ring-2 ring-emerald-400/45 scale-125 animate-pulse"
                              : "bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Question Panel */}
                  <div className="p-5 bg-[#09150e] rounded-2xl border border-emerald-950 mb-6">
                    <span className="inline-block px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded mb-3 font-mono">
                      ՀԱՐՑԱԴՐՈՒՄ
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                      {campaignQuestions[campaignIdx]?.questionArm}
                    </h4>
                  </div>

                  {/* Choices options grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {campaignQuestions[campaignIdx]?.options.map((opt, oIdx) => {
                      const isSelected = selectedCampaignAnswer === opt;
                      const isCorrect = opt === campaignQuestions[campaignIdx].correctAnswer;
                      
                      let btnStyle = "bg-[#111f16] border-emerald-950 text-slate-300 hover:bg-[#1a3022]";
                      
                      if (selectedCampaignAnswer !== null) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-900/80 border-emerald-400 text-slate-100 font-bold";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-950/80 border-rose-500 text-rose-300";
                        } else {
                          btnStyle = "bg-[#09150e] border-slate-900 text-slate-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`camp-opt-${oIdx}`}
                          disabled={selectedCampaignAnswer !== null}
                          onClick={() => handleCampaignAnswer(opt)}
                          className={`p-4 rounded-xl text-left border-2 text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span className="flex-1 pr-3">{opt}</span>
                          
                          {/* Solder active highlights / correctness feedback indicators */}
                          <div className="flex items-center gap-1">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                speakSpanishText(opt);
                              }}
                              className="p-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono hover:text-emerald-400 transition"
                              title="Լսել արտասանությունը"
                            >
                              🔊
                            </span>
                            
                            {selectedCampaignAnswer !== null && isCorrect && (
                              <Check className="w-5 h-5 text-emerald-400" />
                            )}
                            {selectedCampaignAnswer !== null && isSelected && !isCorrect && (
                              <X className="w-5 h-5 text-rose-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer Feedback state with Detailed Armenian Explanations */}
                  <AnimatePresence>
                    {selectedCampaignAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`p-4 rounded-xl border mb-6 ${
                          campaignAnswerIsCorrect
                            ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-200"
                            : "bg-[#1f1616] border-rose-900/60 text-rose-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                          {campaignAnswerIsCorrect ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Check className="w-4.5 h-4.5" /> ՃԻՇՏ Է! +15 Միավոր
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-450 text-rose-400">
                              <X className="w-4.5 h-4.5" /> ՍԽԱԼ Է... (Ճիշտ պատասխանն է՝ «{campaignQuestions[campaignIdx].correctAnswer}»)
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs leading-relaxed text-slate-300 font-mono">
                          {campaignQuestions[campaignIdx].explanationArm}
                        </p>

                        <div className="mt-3 flex justify-end">
                          <button
                            id="campaign-next-question-btn"
                            onClick={advanceCampaign}
                            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-slate-100 font-bold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer"
                          >
                            Հաջորդը
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )}

              {/* Finished / Victory Campaign view */}
              {campaignCompleted && (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-24 h-24 bg-amber-950 rounded-full flex items-center justify-center mb-6 border-4 border-amber-500 shadow-xl shadow-amber-500/10 animate-bounce">
                    <Award className="w-12 h-12 text-amber-400" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-2">
                    Շնորհավորում ենք! 🎉
                  </h3>
                  <p className="text-emerald-400 font-bold text-sm mb-4">
                    Տնակը լիովին պատրաստ է և շողշողում է բնության գրկում
                  </p>

                  <p className="text-xs text-slate-300 max-w-md leading-relaxed mb-8 font-mono">
                    Դուք հաջողությամբ պատասխանեցիք իսպաներենի բոլոր 12 հարցերին՝ կառուցելով քայլ առ քայլ այս հիասքանչ քոթեջը:
                    Հիմա կարող եք փոխել եղանակները` տեսնելու համար ձյունը կամ գիշերային աստղերը տան վրա, կամ սկսել նոր ճամփորդություն!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      id="campaign-restart-btn"
                      onClick={() => {
                        initializeCampaign();
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Սկսել Նոր Ճամփորդություն
                    </button>
                    
                    <button
                      id="go-practice-tab"
                      onClick={() => {
                        setActiveTab("practice");
                        if (soundEnabled) playSynthSound("build");
                      }}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-750 text-slate-100 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      Նախընտրել Անվերջ Մարզումը
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: UNLIMITED PRACTICE WORKSPACE        */}
          {/* ========================================== */}
          {activeTab === "practice" && (
            <div>
              
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-100">
                  Անվերջ Պրակտիկա և Մարզում
                </h3>
              </div>

              <p className="text-xs text-slate-350 leading-relaxed max-w-xl mb-6">
                Ընտրիր գիտելիքներիդ համապատասխանող ցանկացած թեմաներից մեկը: Պատասխանիր հարցերին, հեռացրու սխալներդ, վաստակիր 🪙 <strong className="text-amber-400">10 միավոր</strong> ամեն ճիշտ պատասխանի համար:
              </p>

              {/* Grid selecting category to practice */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {QUIZ_CATEGORIES.map((cat, idx) => {
                  const isSelected = selectedPracticeCategory === cat.id;
                  
                  return (
                    <button
                      key={idx}
                      id={`practice-cat-${cat.id}`}
                      onClick={() => startPracticeCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-950 border-emerald-400 shadow-md text-emerald-300 font-bold scale-102"
                          : "bg-[#09150e] border-emerald-950 text-slate-400 hover:border-emerald-800/40 hover:text-slate-200"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#16271c] border border-emerald-900/30 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                        {cat.id === "time" && <Clock className="w-4 h-4" />}
                        {cat.id === "days" && <Calendar className="w-4 h-4" />}
                        {cat.id === "gender" && <Sparkles className="w-4 h-4" />}
                        {cat.id === "numbers" && <Hash className="w-4 h-4" />}
                      </div>
                      
                      <span className="text-[11px] block leading-tight">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Practice Question area */}
              {selectedPracticeCategory && practiceQuestion ? (
                <div className="p-5 bg-[#09150e] rounded-2xl border border-emerald-950">
                  
                  <div className="flex items-center justify-between border-b border-emerald-950 pb-3 mb-4 text-xs font-semibold text-slate-400">
                    <span className="text-emerald-400">Թեմատիկ փուլ</span>
                    <span>Ճիշտ պատասխաններ՝ {practiceCorrectCount}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-100 mb-5 leading-normal font-mono">
                    {practiceQuestion.questionArm}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {practiceQuestion.options.map((opt, oIdx) => {
                      const isSelected = selectedPracticeAnswer === opt;
                      const isCorrect = opt === practiceQuestion.correctAnswer;
                      
                      let btnStyle = "bg-[#111f16] border-emerald-950 text-slate-300 hover:bg-[#1a3022]";
                      if (selectedPracticeAnswer !== null) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-900/80 border-emerald-400 text-slate-100 font-bold";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-950/80 border-rose-500 text-rose-300";
                        } else {
                          btnStyle = "bg-[#09150e] border-slate-900 text-slate-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`practic-opt-${oIdx}`}
                          disabled={selectedPracticeAnswer !== null}
                          onClick={() => handlePracticeAnswer(opt)}
                          className={`p-3.5 rounded-xl text-left border text-xs sm:text-sm font-semibold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span className="flex-1 pr-2">{opt}</span>
                          
                          <div className="flex items-center gap-1">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                speakSpanishText(opt);
                              }}
                              className="p-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono hover:text-emerald-400 transition"
                            >
                              🔊
                            </span>
                            
                            {selectedPracticeAnswer !== null && isCorrect && (
                              <Check className="w-4 h-4 text-emerald-400" />
                            )}
                            {selectedPracticeAnswer !== null && isSelected && !isCorrect && (
                              <X className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback explanation block */}
                  <AnimatePresence>
                    {selectedPracticeAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`p-4 rounded-xl border mb-3 ${
                          practiceAnswerIsCorrect
                            ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-250"
                            : "bg-[#1f1616] border-rose-900/60 text-rose-250"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5 font-bold text-xs">
                          {practiceAnswerIsCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="w-4.5 h-4.5" /> Ճիշտ պատասխան! +10 🪙
                            </span>
                          ) : (
                            <span className="text-rose-450 text-rose-400 flex items-center gap-1">
                              <X className="w-4.5 h-4.5" /> Ոչ ճիշտ (Ճիշտ տարբերակն է՝ «{practiceQuestion.correctAnswer}»)
                            </span>
                          )}
                        </div>

                        <p className="text-xs leading-relaxed text-slate-300 mb-3 font-mono">
                          {practiceQuestion.explanationArm}
                        </p>

                        <div className="flex justify-end">
                          <button
                            id="practice-next-btn"
                            onClick={nextPracticeQuestion}
                            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-slate-100 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            Հաջորդ հարցը
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-emerald-900/40 rounded-2xl text-center bg-[#09150e]/50">
                  <span className="text-4xl block mb-3">🧭</span>
                  <p className="text-sm text-slate-400">
                    Խնդրում ենք ընտրել վերոնշյալ 4 թեմաներից որևէ մեկը՝ մարզական հարցերը սկսելու համար
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: LEXICON DICTIONARY / Study Cards     */}
          {/* ========================================== */}
          {activeTab === "dictionary" && (
            <div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4 mb-6">
                
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">
                      Իսպաներեն-Հայերեն Բառարան
                    </h3>
                    <p className="text-xs text-slate-400">
                      Բառերի ճիշտ արտասանությունն ու քերականական նշումները
                    </p>
                  </div>
                </div>

                {/* Search Text Box */}
                <input
                  id="dict-search-box"
                  type="text"
                  placeholder="Փնտրել բառ..."
                  value={dictSearch}
                  onChange={(e) => setDictSearch(e.target.value)}
                  className="px-3.5 py-1.5 bg-[#09150e] border border-emerald-900/40 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 max-w-xs"
                />

              </div>

              {/* Category tabs filters inside dictionary */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <button
                  id="dict-filter-all"
                  onClick={() => setDictFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    dictFilter === "all"
                      ? "bg-emerald-800 text-slate-100"
                      : "bg-[#09150e] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Բոլորը
                </button>
                <button
                  id="dict-filter-time"
                  onClick={() => setDictFilter("time")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    dictFilter === "time"
                      ? "bg-emerald-800 text-slate-100"
                      : "bg-[#09150e] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  Ժամանակ
                </button>
                <button
                  id="dict-filter-days"
                  onClick={() => setDictFilter("days")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    dictFilter === "days"
                      ? "bg-emerald-800 text-slate-100"
                      : "bg-[#09150e] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  Օրեր
                </button>
                <button
                  id="dict-filter-gender"
                  onClick={() => setDictFilter("gender")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    dictFilter === "gender"
                      ? "bg-emerald-800 text-slate-100"
                      : "bg-[#09150e] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Սեռեր
                </button>
                <button
                  id="dict-filter-numbers"
                  onClick={() => setDictFilter("numbers")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    dictFilter === "numbers"
                      ? "bg-emerald-800 text-slate-100"
                      : "bg-[#09150e] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Hash className="w-3 h-3" />
                  Թվեր
                </button>
              </div>

              {/* Vocabulary Interactive Flip-cards and List Deck */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[340px] overflow-y-auto pr-2">
                {filteredVocabulary.length > 0 ? (
                  filteredVocabulary.map((word, wIdx) => (
                    <div
                      key={wIdx}
                      className="p-4 bg-[#09150e] border border-emerald-950 rounded-2xl hover:border-emerald-700/50 transition duration-300 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-400 block mb-0.5 select-all">
                            {word.spanish}
                          </span>
                          
                          <span className="text-[10px] text-slate-400 italic block">
                            Արտասանություն՝ [{word.pronunciation}]
                          </span>
                        </div>

                        <button
                          id={`speak-word-${wIdx}`}
                          onClick={() => speakSpanishText(word.spanish)}
                          className="p-1 px-2.5 rounded-lg bg-[#16271c] hover:bg-[#1a3825] text-slate-100 text-xs flex items-center gap-1 transition"
                          title="Լսել բարձրաձայն"
                        >
                          🔊
                        </button>
                      </div>

                      <div className="border-t border-emerald-950/60 pt-2 mt-2">
                        <span className="text-xs text-slate-200 font-medium block">
                          {word.armenian}
                        </span>

                        {word.notes && (
                          <div className="mt-1 pb-1 flex items-start gap-1 p-1 bg-[#16271c]/30 rounded">
                            <Info className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-zinc-400 leading-tight">
                              {word.notes}
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-8 col-span-2">
                    Համապատասխան բառեր չգտնվեցին...
                  </p>
                )}
              </div>

            </div>
          )}

        </section>

      </main>

      {/* ========================================== */}
      {/* QUICK INSTRUCTIONS BLOCK                   */}
      {/* ========================================== */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 mt-12">
        <div className="bg-[#16271c]/60 border border-emerald-900/20 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center gap-6 justify-between">
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#09150e] rounded-2xl text-emerald-400 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Ինչպե՞ս է աշխատում «Փայտե Տնակը»
              </h4>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-1">
                Անցեք իսպաներենի թեստն ու վիկտորինան՝ ժամանակի, շաբաթվա օրերի, գոյականների սեռերի և թվերի մասին:
                Ամեն հաջող պատասխան ոչ միայն զարգացնում է ձեր լեզվական գիտելիքները, այլև ավելացնում է ձեր 3D տնակի գեղեցիկ մասնիկները։
                Ավարտին բացեք բնության ողջ շքեղությունը, կայծերն ու լուսամփոփները։
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center md:text-right border-t md:border-t-0 border-emerald-900/20 pt-4 md:pt-0 w-full md:w-auto">
            <span>Մշակված է Google AI Studio Build միջավայրում</span>
            <br />
            <span>Հայերեն-Իսպաներեն Ուսումնական Նախագիծ © 2026</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
