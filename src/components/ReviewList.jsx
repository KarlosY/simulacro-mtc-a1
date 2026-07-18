import React from 'react';
import questionsData from '../data/questions.json';

const ReviewList = () => {
  return (
    <div className="container" style={{maxWidth: '900px', paddingBottom: '4rem'}}>
      <h1 style={{textAlign: 'center', marginBottom: '1rem'}}>Modo Repaso - Balotario Oficial</h1>
      <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem'}}>
        Estudia las 200 preguntas oficiales del MTC A1. La alternativa sombreada en verde es la respuesta correcta para el examen.
      </p>
      
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <a href="/" className="btn btn-primary" style={{textDecoration: 'none', padding: '0.8rem 1.5rem'}}>Volver al Inicio</a>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
        {questionsData.map((q) => (
          <div key={q.id} className="glass-panel" style={{padding: '1.5rem'}}>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <span style={{
                background: 'var(--accent)', 
                color: 'white', 
                borderRadius: '50%', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 'bold'
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
            
            <div style={{paddingLeft: '3rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
              Respuesta cruda del PDF: <strong>{q.raw_answer}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
