import { useState, useEffect } from 'react';

export function useLearned() {
  const [learned, setLearned] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('alifbo_learned');
    if (saved) {
      try {
        setLearned(JSON.parse(saved));
      } catch (e) {
        setLearned([]);
      }
    }
  }, []);

  const toggle = (id) => {
    setLearned(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('alifbo_learned', JSON.stringify(next));
      return next;
    });
  };

  const isLearned = (id) => learned.includes(id);

  return { learned, toggle, isLearned };
}
