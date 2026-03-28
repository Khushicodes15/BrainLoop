import { useState, useEffect, useCallback } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LoopySVG } from '@/components/LoopySVG';
import { uploadDocument, getDocuments, deleteDocument } from '@/lib/api';

interface Doc {
  id: string;
  name: string;
  uploaded_at?: string;
}

const UploadPage = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await getDocuments();
      setDocs(res.data);
    } catch {
      // empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setStatus('idle');
    setProgress(0);
    try {
      await uploadDocument(file, setProgress);
      setStatus('success');
      fetchDocs();
    } catch (e: any) {
      setStatus('error');
      setError(e?.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocs((d) => d.filter((doc) => doc.id !== id));
    } catch { /* silent */ }
  };

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-heading font-bold mb-2">Upload Documents</h1>
      <p className="text-muted-foreground mb-8">Drop your PDFs and let BrainLoop work its magic</p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          dragging ? 'border-primary bg-accent/50 scale-[1.01]' : 'border-border hover:border-primary/50 bg-card'
        }`}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf';
          input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) handleUpload(file);
          };
          input.click();
        }}
      >
        <LoopySVG variant="card" className="absolute top-2 right-2 w-24 h-24" />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-1">Drag & drop your PDF here</p>
        <p className="text-sm text-muted-foreground">or click to browse</p>
      </div>

      {/* Progress */}
      {uploading && (
        <div className="mt-6">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">Uploading... {progress}%</p>
        </div>
      )}

      {/* Status */}
      {status === 'success' && (
        <div className="mt-4 flex items-center gap-2 text-secondary">
          <CheckCircle className="h-5 w-5" /> Upload successful!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {/* Documents */}
      <div className="mt-12">
        <h2 className="text-xl font-heading font-semibold mb-4">Your Documents</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl shadow-card">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No documents yet. Upload your first PDF above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <FileText className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    {doc.uploaded_at && (
                      <p className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
