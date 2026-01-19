import React, { useState, useEffect, useRef, useCallback } from 'react';

// Adding professional animations and styling
const styles = `
  @keyframes wave {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(15deg) scale(1.1); }
    75% { transform: rotate(-15deg) scale(1.1); }
  }
  .speaking-robot {
    animation: wave 0.8s infinite;
  }
  .welcome-ai-speech {
    transition: opacity 0.5s, transform 0.5s;
    transform: translateY(20px);
    opacity: 0;
  }
  .welcome-ai-speech.visible {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Move outside component to prevent re-creation on every render
const welcomeMessages = [
  "أهلاً بك في سمسار، بوابتك الأولى لعالم العقارات في مصر. استكشف أفضل الفرص الاستثمارية والسكنية اليوم.",
  "مرحباً بك. في سمسار، نجمع لك أرقى العقارات وأكثرها تميزاً. دعنا نساعدك في العثور على منزل أحلامك.",
  "أهلاً بك في المستقبل العقاري. سمسار يقدم لك تجربة ذكية وسلسة للبحث عن عقارك المثالي. من أين نبدأ البحث؟",
  "مرحباً! سواء كنت تبحث عن شقة، فيلا، أو مكتب، سمسار هو شريكك الموثوق. استمتع بجولتك في منصتنا.",
];

const WelcomeAISpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const utteranceRef = useRef(null);
  const hasPlayedOnceRef = useRef(false);

  const setupSpeech = useCallback(() => {
    if (typeof window.speechSynthesis === 'undefined') {
      console.warn("المتصفح لا يدعم نطق الكلام.");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    // Prefer high-quality voices (often contain 'Google' or 'Microsoft') and fallback gracefully
    const preferredVoice =
      voices.find(v => v.lang.startsWith('ar') && v.name.includes('Microsoft')) ||
      voices.find(v => v.lang.startsWith('ar') && v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('ar-SA')) ||
      voices.find(v => v.lang.startsWith('ar'));

    if (!utteranceRef.current) {
      const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      const utterance = new SpeechSynthesisUtterance(randomMessage);
      utterance.lang = 'ar-EG'; // Default language
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // A bit more expressive pitch
      utterance.onend = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
    }

    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
      utteranceRef.current.lang = preferredVoice.lang;
    }

    // Show the component after a short delay for a smoother entry
    setTimeout(() => setIsVisible(true), 1000);
  }, []); // Removed welcomeMessages dependency as it is now constant

  useEffect(() => {
    setupSpeech();
    // Voices can load asynchronously, so we listen for the change
    window.speechSynthesis.onvoiceschanged = setupSpeech;

    const speakOnInteraction = () => {
      if (hasPlayedOnceRef.current || !utteranceRef.current || window.speechSynthesis.speaking) return;

      window.speechSynthesis.speak(utteranceRef.current);
      setIsSpeaking(true);
      hasPlayedOnceRef.current = true;

      // Clean up listeners after the first automatic play
      document.removeEventListener('click', speakOnInteraction);
      document.removeEventListener('scroll', speakOnInteraction);
    };

    // Wait for the first user interaction to play the welcome message automatically
    document.addEventListener('click', speakOnInteraction, { once: true });
    document.addEventListener('scroll', speakOnInteraction, { once: true });

    // تنظيف عند إزالة المكون
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
      document.removeEventListener('click', speakOnInteraction);
      document.removeEventListener('scroll', speakOnInteraction);
    };
  }, [setupSpeech]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (utteranceRef.current) {
      // If it hasn't played automatically yet, mark it as played now
      if (!hasPlayedOnceRef.current) {
        hasPlayedOnceRef.current = true;
      }
      window.speechSynthesis.speak(utteranceRef.current);
      setIsSpeaking(true);
    }
  };

  // Don't render anything until it's ready to be shown
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      <div
        className={`position-fixed bottom-0 m-3 p-2 bg-light rounded-pill shadow-lg d-flex align-items-center welcome-ai-speech ${isVisible ? 'visible' : ''}`}
        style={{ zIndex: 9998, left: '90px', cursor: 'pointer' }}
        title={isSpeaking ? 'إيقاف رسالة الترحيب' : 'إعادة تشغيل رسالة الترحيب'}
        onClick={toggleSpeech}
      >
        <button
          className={`btn btn-sm rounded-circle ${isSpeaking ? 'btn-danger' : 'btn-primary'} me-2`}
          style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}
        >
          <span className={isSpeaking ? 'speaking-robot' : ''} style={{ fontSize: '1.2rem' }}>
            {isSpeaking ? '🤫' : '🤖'}
          </span>
        </button>

        <div className="d-flex flex-column justify-content-center">
          <span className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>الترحيب الذكي</span>
          <span className="text-muted" style={{ fontSize: '0.65rem' }}>{isSpeaking ? 'يتحدث الآن...' : 'اضغط للتحدث'}</span>
        </div>
      </div>
    </>
  );
};

export default WelcomeAISpeech;