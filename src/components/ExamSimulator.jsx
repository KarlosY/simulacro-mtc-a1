import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import QuestionView from './QuestionView';
import ResultsReview from './ResultsReview';
import { BookOpen, Award, Clock } from 'lucide-react';
import questionsData from '../data/questions.json';

// Fisher-Yates shuffle to randomize questions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const EXAM_TIME = 40 * 60; // 40 minutes in seconds

const ExamSimulator = () => {
  const [examState, setExamState] = useState('start'); // 'start', 'playing', 'results'
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_TIME);

  useEffect(() => {
    let timer;
    if (examState === 'playing' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeRemaining]);

  const handleStart = () => {
    // Select 40 random questions from the bank
    const selected = shuffleArray(questionsData).slice(0, 40);
    setQuestions(selected);
    setAnswers({});
    setCurrentQIndex(0);
    setTimeRemaining(EXAM_TIME);
    setExamState('playing');
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const finishExam = () => {
    setExamState('results');
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (examState === 'start') {
    return (
      <div className="animate-fade-in" style={styles.startContainer}>
        <div className="glass-panel" style={styles.heroCard}>
          <div style={styles.iconWrapper}>
            <Award size={48} color="var(--accent)" />
          </div>
          <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Simulador MTC A1</h1>
          <p style={{color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem'}}>
            Prepárate para tu examen de reglas de tránsito. Este simulador utiliza preguntas reales del balotario oficial del Ministerio de Transportes y Comunicaciones del Perú.
          </p>
          
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <BookOpen size={24} color="var(--accent)" />
              <span>40 Preguntas Aleatorias</span>
            </div>
            <div style={styles.featureItem}>
              <Clock size={24} color="var(--accent)" />
              <span>40 Minutos de Tiempo</span>
            </div>
            <div style={styles.featureItem}>
              <Award size={24} color="var(--accent)" />
              <span>Mínimo 35 para Aprobar</span>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center'}}>
            <button className="btn btn-primary" style={{padding: '1rem 2rem', fontSize: '1.1rem'}} onClick={handleStart}>
              Rendir Examen
            </button>
            <a href="/review" className="btn btn-secondary" style={{padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
              Modo Repaso
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (examState === 'results') {
    return (
      <ResultsReview 
        questions={questions}
        answers={answers}
        score={calculateScore()}
        timeSpent={EXAM_TIME - timeRemaining}
        onRestart={handleStart}
      />
    );
  }

  return (
    <div style={styles.playingContainer}>
      <div style={styles.playingHeader}>
        <h2 style={{fontSize: '1.25rem'}}>Simulacro en curso</h2>
        <Timer timeRemaining={timeRemaining} onTimeUp={finishExam} />
      </div>
      
      <QuestionView 
        question={questions[currentQIndex]}
        questionIndex={currentQIndex}
        totalQuestions={questions.length}
        selectedAnswer={answers[currentQIndex]}
        onSelectAnswer={handleAnswerSelect}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

const styles = {
  startContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh'
  },
  heroCard: {
    padding: '4rem 3rem',
    textAlign: 'center',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconWrapper: {
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '1.5rem',
    borderRadius: '50%',
    marginBottom: '1.5rem'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    textAlign: 'left',
    background: 'rgba(0,0,0,0.2)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem'
  },
  playingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  playingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '1rem'
  }
};

export default ExamSimulator;
