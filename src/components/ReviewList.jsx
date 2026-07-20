import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Square, Play, Pause, Headphones } from 'lucide-react';
import questionsData from '../data/questions.json';

const ReviewList = () => {
  const [speakingId, setSpeakingId] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayIndexRef = useRef(-1);
  const isAutoPlayingRef = useRef(false);

  useEffect(() => {
    // Stop speaking when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakQuestion = (index) => {
    if (index >= questionsData.length) {
      stopSpeaking();
      return;
    }
    
    const q = questionsData[index];
    setSpeakingId(q.id);
    
    // Auto-scroll so the user can follow along visually
    setTimeout(() => {
      const el = document.getElementById(`question-${q.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    const correctAnswerText = q.options[q.correctAnswer];
    // Added a small phonetic pause (", ") for better pacing
    const textToSpeak = `Pregunta ${q.id}. ${q.question}. Respuesta correcta: ${correctAnswerText}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-PE'; // Try Peruvian Spanish
    utterance.rate = 0.95; // Slightly slower for better comprehension
    
    utterance.onend = () => {
      if (isAutoPlayingRef.current) {
        autoPlayIndexRef.current += 1;
        // Pause 1 second before the next question
        setTimeout(() => {
          if (isAutoPlayingRef.current) {
            speakQuestion(autoPlayIndexRef.current);
          }
        }, 1500); 
      } else {
        setSpeakingId(null);
      }
    };
    
    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      // Try to recover autoplay if it fails on one question
      if (isAutoPlayingRef.current) {
        autoPlayIndexRef.current += 1;
        setTimeout(() => {
           if (isAutoPlayingRef.current) speakQuestion(autoPlayIndexRef.current);
        }, 1000);
      } else {
        setSpeakingId(null);
      }
    };

    window.speechSynthesis.cancel(); // clear previous
    window.speechSynthesis.speak(utterance);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      stopSpeaking();
    } else {
      isAutoPlayingRef.current = true;
      setIsAutoPlaying(true);
      // Start from currently speaking question, or from the beginning
      const startIndex = speakingId ? questionsData.findIndex(q => q.id === speakingId) : 0;
      autoPlayIndexRef.current = startIndex !== -1 ? startIndex : 0;
      speakQuestion(autoPlayIndexRef.current);
    }
  };

  const stopSpeaking = () => {
    isAutoPlayingRef.current = false;
    setIsAutoPlaying(false);
    setSpeakingId(null);
    window.speechSynthesis.cancel();
  };

  const handleSpeakSingle = (q) => {
    // If they click the currently speaking question, stop it
    if (speakingId === q.id && !isAutoPlaying) {
      stopSpeaking();
      return;
    }
    
    // Stop autoplay if it was running, and just play this single question
    isAutoPlayingRef.current = false;
    setIsAutoPlaying(false);
    autoPlayIndexRef.current = questionsData.findIndex(item => item.id === q.id);
    speakQuestion(autoPlayIndexRef.current);
  };

  return (
    <div className="container" style={{maxWidth: '900px', paddingBottom: '4rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '1rem'}}>Modo Repaso - Balotario Oficial</h1>
      <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem'}}>
        Estudia las 200 preguntas oficiales del MTC A1. La alternativa sombreada en verde es la respuesta correcta para el examen.
      </p>
      
      <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap'}}>
        <a href="/" className="btn btn-secondary" style={{textDecoration: 'none', padding: '0.8rem 1.5rem'}}>
          Volver al Inicio
        </a>
        
        <button 
          onClick={toggleAutoPlay}
          className="btn"
          style={{
            background: isAutoPlaying ? 'rgba(239, 68, 68, 0.1)' : 'var(--accent)',
            color: isAutoPlaying ? '#ef4444' : 'white',
            border: isAutoPlaying ? '1px solid #ef4444' : '1px solid var(--accent)',
            padding: '0.8rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          {isAutoPlaying ? (
            <>
              <Square size={20} fill="currentColor" /> Detener Repaso Intensivo
            </>
          ) : (
            <>
              <Headphones size={20} /> Iniciar Repaso Intensivo (Audio)
            </>
          )}
        </button>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
        {questionsData.map((q) => (
          <div key={q.id} id={`question-${q.id}`} className="glass-panel" style={{
            padding: '1.5rem', 
            borderColor: speakingId === q.id ? 'var(--accent)' : 'var(--glass-border)',
            boxShadow: speakingId === q.id ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1}}>
                <span style={{
                  background: speakingId === q.id ? 'var(--accent)' : 'var(--glass-border)', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 'bold',
                  transition: 'background 0.3s'
                }}>
                  {q.id}
                </span>
                <div>
                  <h3 style={{marginTop: '0.2rem', fontSize: '1.1rem'}}>{q.question}</h3>
                  {q.imageUrl && (
                    <div style={{marginTop: '1rem', marginBottom: '0.5rem'}}>
                      <img src={q.imageUrl} alt="Señal de tránsito" style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px'}} />
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => handleSpeakSingle(q)}
                style={{
                  background: (speakingId === q.id && !isAutoPlaying) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: (speakingId === q.id && !isAutoPlaying) ? '#ef4444' : 'var(--accent)',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  opacity: isAutoPlaying ? 0.5 : 1 // Dim single play buttons when auto-playing
                }}
                disabled={isAutoPlaying}
                title={(speakingId === q.id && !isAutoPlaying) ? "Detener lectura" : "Leer pregunta y respuesta"}
              >
                {(speakingId === q.id && !isAutoPlaying) ? <Square size={18} fill="currentColor" /> : <Volume2 size={20} />}
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '3rem'}}>
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.correctAnswer;
                return (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--glass-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <strong style={{color: isCorrect ? 'var(--success)' : 'var(--text-secondary)'}}>
                      {String.fromCharCode(97 + idx)})
                    </strong>
                    <span style={{color: isCorrect ? 'var(--success)' : 'inherit', fontWeight: isCorrect ? '500' : 'normal'}}>
                      {opt}
                    </span>
                    {isCorrect && <span style={{marginLeft: 'auto', color: 'var(--success)', fontWeight: 'bold'}}>[CORRECTA]</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
