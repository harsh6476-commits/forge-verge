import React, { useState, useEffect } from 'react';
import { AssignedItem } from '../types/api';
import {
  CheckCircle2,
  Circle,
  Clock,
  Upload,
  FileText,
  Trash2,
  ChevronRight,
  ExternalLink,
  Save,
  Code2,
} from 'lucide-react';
import { compressImage } from '../lib/imageCompression';
import { clsx } from 'clsx';

interface TopicDetailProps {
  item: AssignedItem;
  dateStr: string;
  onSubtopicToggle: (itemId: string, subtopicId: string, completed: boolean) => void;
  onItemToggle: (itemId: string, completed: boolean) => void;
  onSaveNotes: (itemId: string, notes: string) => Promise<void>;
  onUploadAttachment: (itemId: string, file: File) => Promise<void>;
  onDeleteAttachment: (itemId: string, publicId: string) => Promise<void>;
  onNextTopic: () => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  item,
  onSubtopicToggle,
  onItemToggle,
  onSaveNotes,
  onUploadAttachment,
  onDeleteAttachment,
  onNextTopic,
}) => {
  const [notes, setNotes] = useState(item.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<{
    file: File;
    originalSize: number;
    compressedSize: number;
    previewUrl: string;
  } | null>(null);

  useEffect(() => {
    setNotes(item.notes || '');
  }, [item.itemId, item.notes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes !== (item.notes || '')) {
        setSavingNotes(true);
        onSaveNotes(item.itemId, notes).finally(() => setSavingNotes(false));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [notes, item.itemId, item.notes, onSaveNotes]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const compressed = await compressImage(f);
    setUploadPreview(compressed);
  };

  const handleConfirmUpload = async () => {
    if (!uploadPreview) return;
    setUploading(true);
    try {
      await onUploadAttachment(item.itemId, uploadPreview.file);
      setUploadPreview(null);
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-surface border-2 border-border rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full shadow-crisp font-sans text-ink">
      <div className="space-y-6 overflow-y-auto pr-2">
        {/* Header */}
        <div className="border-b-2 border-border pb-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider font-mono">
            <span className="uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-md border border-accent shadow-crisp-sm">
              {item.category}
            </span>
            <span className="flex items-center gap-1.5 text-ink-muted">
              <Clock className="w-4 h-4 text-accent" />
              {item.estimatedMinutes} MINS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight leading-snug pt-1">
            {item.title}
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pt-1">
            {item.description}
          </p>
        </div>

        {/* What You Will Learn */}
        {item.whatYouWillLearn && item.whatYouWillLearn.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-accent font-mono">
              What You Will Learn
            </h3>
            <ul className="text-xs sm:text-sm text-ink space-y-2.5 list-disc list-inside bg-surface-muted p-4 sm:p-5 rounded-2xl border border-border shadow-crisp-sm leading-relaxed font-medium">
              {item.whatYouWillLearn.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Subtopics Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-accent">
              Subtopics Checklist
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-surface-muted border border-border shadow-crisp-sm text-ink">
              {item.subtopics.filter((s) => s.completed).length} / {item.subtopics.length} DONE
            </span>
          </div>

          <div className="space-y-3">
            {item.subtopics.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSubtopicToggle(item.itemId, sub.id, !sub.completed)}
                className={clsx(
                  'p-4 rounded-2xl border-2 border-border cursor-pointer transition-all flex items-start gap-3.5 text-xs sm:text-sm shadow-crisp-sm',
                  sub.completed
                    ? 'bg-surface-muted text-ink-muted opacity-80'
                    : 'bg-surface-bright hover:bg-surface text-ink'
                )}
              >
                <button className="mt-0.5 shrink-0 text-ink hover:text-accent transition-colors">
                  {sub.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-accent fill-accent/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-ink-muted" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={clsx('font-bold', sub.completed && 'line-through text-ink-muted')}>
                    {sub.name}
                  </div>
                  {sub.description && (
                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                      {sub.description}
                    </p>
                  )}
                  {sub.explanation && (
                    <div className="mt-2.5 p-3 rounded-xl bg-surface border border-border font-mono text-xs text-accent font-bold leading-relaxed">
                      {sub.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Task */}
        {item.practicalTask && (
          <div className="space-y-2 p-5 bg-surface-muted border-2 border-border rounded-2xl text-xs sm:text-sm shadow-crisp">
            <div className="font-extrabold uppercase tracking-widest text-accent font-mono flex items-center gap-1.5">
              <Code2 className="w-4 h-4" /> Practical Implementation
            </div>
            <p className="leading-relaxed font-medium text-ink">{item.practicalTask}</p>
            {item.expectedOutcome && (
              <p className="text-xs font-bold text-ink-muted pt-2 border-t border-border">
                Expected: {item.expectedOutcome}
              </p>
            )}
          </div>
        )}

        {/* Supporting Practice (DSA Recall) */}
        {item.supportingPractice && (
          <div className="space-y-2 p-5 bg-focus/10 border-2 border-focus/30 rounded-2xl text-xs sm:text-sm shadow-crisp-sm">
            <div className="font-extrabold uppercase tracking-widest text-focus font-mono flex items-center gap-1.5">
              <Code2 className="w-4 h-4" /> Supporting Practice / DSA Recall
            </div>
            <p className="leading-relaxed font-medium text-ink">{item.supportingPractice}</p>
          </div>
        )}

        {/* Personal Study Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-accent">
              Personal Study Notes
            </h3>
            {savingNotes && (
              <span className="text-[11px] font-bold text-accent flex items-center gap-1">
                <Save className="w-3.5 h-3.5 animate-spin" /> Saving...
              </span>
            )}
          </div>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document code insights, algorithms trade-offs, and thoughts..."
            className="w-full bg-surface-bright border-2 border-border focus:border-accent rounded-2xl p-4 text-xs sm:text-sm text-ink outline-none resize-y transition-colors font-mono shadow-crisp-sm leading-relaxed"
          />
        </div>

        {/* Attachments Section */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-accent">
              Attachments ({item.attachments?.length || 0})
            </h3>
            <label className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Add Screenshot / PDF</span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {/* Upload Preview & Compression Comparison */}
          {uploadPreview && (
            <div className="p-4 bg-surface-muted border-2 border-border rounded-2xl text-xs space-y-2.5 shadow-crisp-sm">
              <div className="flex items-center justify-between font-bold">
                <span>Compressing Image:</span>
                <span className="text-accent font-extrabold">
                  {Math.round(uploadPreview.originalSize / 1024)} KB →{' '}
                  {Math.round(uploadPreview.compressedSize / 1024)} KB
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={uploading}
                  onClick={handleConfirmUpload}
                  className="px-4 py-2 rounded-xl bg-accent text-white font-extrabold border-2 border-border shadow-crisp-sm"
                >
                  {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
                <button
                  onClick={() => setUploadPreview(null)}
                  className="px-4 py-2 rounded-xl border-2 border-border bg-surface-bright text-ink font-extrabold shadow-crisp-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Existing Attachments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.attachments?.map((att) => (
              <div
                key={att.publicId}
                className="p-3.5 bg-surface-bright border-2 border-border rounded-2xl flex items-center justify-between text-xs shadow-crisp-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-accent shrink-0" />
                  <span className="truncate text-ink font-bold text-xs">
                    {att.originalName}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-ink hover:text-accent rounded-lg border border-transparent hover:border-border"
                    title="View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onDeleteAttachment(item.itemId, att.publicId)}
                    className="p-1.5 text-ink hover:text-accent rounded-lg border border-transparent hover:border-border"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-5 border-t-2 border-border flex items-center justify-between gap-4 font-mono">
        <button
          onClick={() => onItemToggle(item.itemId, !item.completed)}
          className={clsx(
            'px-5 py-3 rounded-2xl text-xs font-extrabold transition-all border-2 border-border shadow-crisp flex items-center gap-2 tracking-wider',
            item.completed
              ? 'bg-surface-muted text-ink'
              : 'bg-surface-bright text-ink hover:bg-surface'
          )}
        >
          {item.completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>MARK INCOMPLETE</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-ink-muted" />
              <span>MARK TOPIC COMPLETE</span>
            </>
          )}
        </button>

        <button
          onClick={onNextTopic}
          className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs uppercase tracking-widest border-2 border-border shadow-crisp hover:shadow-crisp-lg flex items-center gap-2 transition-all"
        >
          <span>NEXT TOPIC</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
