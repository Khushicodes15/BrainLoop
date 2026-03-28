import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

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
export const generateQuiz = (numQuestions = 5) => api.post('/generate-quiz', { num_questions: numQuestions });
export const evaluateAnswer = (questionId: string, answer: string) => api.post('/evaluate-answer', { question_id: questionId, answer });
export const generateFlashcards = (numCards = 5) => api.post('/generate-flashcards', { num_cards: numCards });
export const getProgress = () => api.get('/progress');
export const getHistory = () => api.get('/history');

export default api;
