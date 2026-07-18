import React from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

const ResultsReview = ({ questions, answers, score, timeSpent, onRestart }) => {
  const totalQuestions = questions.length;
  const isPassed = score >= 35; // MTC requires 35/40 to pass

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div className="glass-panel" style={styles.summaryCard}>
        <div style={styles.scoreCircle(isPassed)}>
          <span style={styles.scoreText}>{score}</span>
          <span style={styles.scoreTotal}>/ {totalQuestions}</span>
        </div>
        
        <h2 style={{...styles.resultTitle, color: isPassed ? 'var(--success)' : 'var(--danger)'}}>
          {isPassed ? '¡Aprobado!' : 'Desaprobado'}
        </h2>
        
        <p style={styles.resultDesc}>
          {isPassed 
            ? '¡Excelente trabajo! Estás listo para rendir el examen oficial del MTC.'
            : 'Necesitas un mínimo de 35 respuestas correctas para aprobar. ¡Sigue practicando!'}
        </p>
        
        <button className="btn btn-primary" onClick={onRestart} style={{marginTop: '1.5rem'}}>
          <RefreshCw size={18} style={{marginRight: '0.5rem'}} />
          Reintentar Simulacro
        </button>
      </div>

      <div style={styles.reviewSection}>
        <h3 style={styles.reviewTitle}>Revisión de Respuestas</h3>
        <div style={styles.questionsList}>
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            const isUnanswered = userAnswer === undefined || userAnswer === null;

            return (
              <div key={idx} className="glass-panel" style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <span style={styles.qNum}>Pregunta {idx + 1}</span>
                  {isCorrect ? (
                    <span style={{color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                      <CheckCircle size={18} /> Correcta
                    </span>
                  ) : isUnanswered ? (
                    <span style={{color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                      <AlertTriangle size={18} /> Sin responder
                    </span>
                  ) : (
                    <span style={{color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                      <XCircle size={18} /> Incorrecta
                    </span>
                  )}
                </div>
                
                <h4 style={styles.qText}>{q.question}</h4>
                
                <div style={styles.optionsReview}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isActuallyCorrect = q.correctAnswer === optIdx;
                    
                    let bg = 'rgba(255,255,255,0.02)';
                    let border = '1px solid var(--glass-border)';
                    
                    if (isActuallyCorrect) {
                      bg = 'rgba(16, 185, 129, 0.1)';
                      border = '1px solid var(--success)';
                    } else if (isSelected && !isCorrect) {
                      bg = 'rgba(239, 68, 68, 0.1)';
                      border = '1px solid var(--danger)';
                    }
                    
                    return (
                      <div key={optIdx} style={{...styles.optItem, background: bg, border}}>
                        <span>{opt}</span>
                        {isActuallyCorrect && <CheckCircle size={16} color="var(--success)" />}
                        {isSelected && !isCorrect && <XCircle size={16} color="var(--danger)" />}
                      </div>
                    );
                  })}
                </div>
                
                {!isCorrect && q.explanation && (
                  <div style={styles.explanation}>
                    <strong>Explicación:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '100%',
    paddingBottom: '4rem'
  },
  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem 2rem',
    textAlign: 'center'
  },
  scoreCircle: (isPassed) => ({
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `4px solid ${isPassed ? 'var(--success)' : 'var(--danger)'}`,
    marginBottom: '1.5rem',
    background: 'rgba(0,0,0,0.2)'
  }),
  scoreText: {
    fontSize: '3rem',
    fontWeight: '700',
    lineHeight: '1',
    color: 'var(--text-primary)'
  },
  scoreTotal: {
    fontSize: '1rem',
    color: 'var(--text-secondary)'
  },
  resultTitle: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  resultDesc: {
    color: 'var(--text-secondary)',
    maxWidth: '400px'
  },
  reviewSection: {
    marginTop: '2rem'
  },
  reviewTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem'
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  reviewCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    fontWeight: '600',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '0.75rem'
  },
  qNum: {
    color: 'var(--text-secondary)'
  },
  qText: {
    fontSize: '1.125rem',
    fontWeight: '500'
  },
  optionsReview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  optItem: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.95rem'
  },
  explanation: {
    marginTop: '0.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderLeft: '4px solid var(--accent)',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: 'var(--text-primary)'
  }
};

export default ResultsReview;
