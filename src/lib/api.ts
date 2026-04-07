import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// -----------------------------
// Document & General AI Features
// -----------------------------
export const uploadDocument = (file: File, onProgress?: (pct: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (e.total && onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
};

export const getDocuments = () => api.get('/documents');
export const deleteDocument = (id: string) => api.delete(`/documents/${id}`);
export const queryAI = (query: string) => api.post('/query', { query });
export const explainAI = (text: string) => api.post('/explain', { text });
export const summarizeAI = (documentId: string) => api.post('/summarize', { document_id: documentId });
export const detectIntent = (text: string) => api.post('/intent', { text });

// -----------------------------
// Quiz Endpoints (Fixed to match backend)
// -----------------------------
export const startQuiz = () => api.post('/quiz/start');

export const submitAnswer = (selected_option: string) => 
  api.post('/quiz/answer', { selected_option });

export const getNextQuestion = () => api.get('/quiz/next');

export const getQuizSummary = () => api.get('/quiz/summary');

// Aliases for backward compatibility (optional)
export const generateQuiz = startQuiz;
export const evaluateAnswer = (selected_option: string) => submitAnswer(selected_option);

// -----------------------------
// Flashcards & Tracking
// -----------------------------
export const generateFlashcards = (numCards = 5) => 
  api.post('/generate-flashcards', { num_cards: numCards });

export const getProgress = () => api.get('/tracking/progress');
export const getHistory = () => api.get('/tracking/history');

export default api;