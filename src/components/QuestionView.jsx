import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const QuestionView = ({ 
  question, 
  questionIndex, 
  totalQuestions, 
  selectedAnswer, 
  onSelectAnswer,
  onNext,
  onPrev
}) => {
  
  return (
    <div className="question-view animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <span style={styles.badge}>Pregunta {questionIndex + 1} de {totalQuestions}</span>
      </div>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        <h2 style={styles.questionText}>{question.question}</h2>
        {question.imageUrl && (
          <div style={{textAlign: 'center', marginBottom: '1rem'}}>
            <img src={question.imageUrl} alt="Señal de tránsito" style={{maxWidth: '100%', maxHeight: '250px', borderRadius: '8px'}} />
          </div>
        )}
      </div>
      
      <div style={styles.optionsList}>
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          return (
            <button 
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              style={{
                ...styles.optionBtn,
                ...(isSelected ? styles.optionSelected : {})
              }}
              className="glass-panel option-btn"
            >
              <div style={styles.iconContainer}>
                {isSelected ? <CheckCircle2 size={24} color="var(--accent)" /> : <Circle size={24} color="var(--text-secondary)" />}
              </div>
              <span style={styles.optionText}>{option}</span>
            </button>
          );
        })}
      </div>
      
      <div style={styles.footer}>
        <button 
          className="btn btn-secondary" 
          onClick={onPrev} 
          disabled={questionIndex === 0}
        >
          Anterior
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onNext}
        >
          {questionIndex === totalQuestions - 1 ? 'Finalizar Examen' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    color: 'var(--accent)',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  questionText: {
    fontSize: '1.5rem',
    fontWeight: '500',
    lineHeight: '1.4'
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    width: '100%',
    textAlign: 'left',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1.125rem'
  },
  optionSelected: {
    borderColor: 'var(--accent)',
    background: 'rgba(59, 130, 246, 0.1)',
    boxShadow: '0 0 0 1px var(--accent)'
  },
  iconContainer: {
    flexShrink: 0,
    display: 'flex'
  },
  optionText: {
    flex: 1
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem'
  }
};

export default QuestionView;
