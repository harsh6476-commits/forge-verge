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

  // Sync notes when selected item changes
  useEffect(() => {
    setNotes(item.notes || '');
  }, [item.itemId, item.notes]);

  // Debounced auto-save notes
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
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              {item.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {item.estimatedMinutes} mins
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-2 tracking-tight">
            {item.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* What You Will Learn */}
        {item.whatYouWillLearn && item.whatYouWillLearn.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300">
              What You Will Learn
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside bg-background/50 p-3 rounded-xl border border-border/60">
              {item.whatYouWillLearn.map((pt, i) => (
                <li key={i} className="leading-relaxed">
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Subtopics Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300">
              Subtopics Checklist
            </h3>
            <span className="text-[11px] font-mono text-teal-400">
              {item.subtopics.filter((s) => s.completed).length} / {item.subtopics.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {item.subtopics.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSubtopicToggle(item.itemId, sub.id, !sub.completed)}
                className={clsx(
                  'p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 text-xs',
                  sub.completed
                    ? 'border-teal-500/30 bg-teal-500/5 text-slate-400'
                    : 'border-border hover:border-slate-700 bg-background text-slate-200'
                )}
              >
                <button className="mt-0.5 shrink-0 text-slate-500 hover:text-teal-400 transition-colors">
                  {sub.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400 fill-teal-500/20" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={clsx('font-semibold', sub.completed && 'line-through text-slate-500')}>
                    {sub.name}
                  </div>
                  {sub.description && (
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {sub.description}
                    </p>
                  )}
                  {sub.explanation && (
                    <div className="mt-1.5 p-2 rounded bg-surface border border-border/80 font-mono text-[10px] text-teal-300">
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
          <div className="space-y-1.5 p-3.5 bg-background rounded-xl border border-border text-xs">
            <div className="font-mono text-[11px] text-teal-400 font-semibold uppercase">
              Practical Implementation
            </div>
            <p className="text-slate-300 leading-relaxed">{item.practicalTask}</p>
            {item.expectedOutcome && (
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Expected: {item.expectedOutcome}
              </p>
            )}
          </div>
        )}

        {/* Personal Notes (Auto-saved) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300">
              Personal Study Notes
            </h3>
            {savingNotes && (
              <span className="text-[10px] font-mono text-teal-400 flex items-center gap-1">
                <Save className="w-3 h-3 animate-spin" /> Saving...
              </span>
            )}
          </div>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document code insights, key complexity findings, and trade-offs..."
            className="w-full bg-background border border-border focus:border-teal-400 rounded-xl p-3 text-xs text-white outline-none resize-y transition-colors font-sans"
          />
        </div>

        {/* Attachments Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300">
              Attachments ({item.attachments?.length || 0})
            </h3>
            <label className="text-xs font-mono text-teal-400 hover:underline flex items-center gap-1 cursor-pointer">
              <Upload className="w-3 h-3" />
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
            <div className="p-3 bg-background border border-teal-500/40 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-300">Compressing Image:</span>
                <span className="text-teal-400">
                  {Math.round(uploadPreview.originalSize / 1024)} KB →{' '}
                  {Math.round(uploadPreview.compressedSize / 1024)} KB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={uploading}
                  onClick={handleConfirmUpload}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold text-xs"
                >
                  {uploading ? 'Uploading to Cloudinary...' : 'Confirm Upload'}
                </button>
                <button
                  onClick={() => setUploadPreview(null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Existing Attachments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.attachments?.map((att) => (
              <div
                key={att.publicId}
                className="p-2.5 bg-background border border-border rounded-lg flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate text-slate-300 text-[11px] font-mono">
                    {att.originalName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-slate-400 hover:text-teal-400"
                    title="View"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => onDeleteAttachment(item.itemId, att.publicId)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation: Toggle Complete & Next Topic */}
      <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
        <button
          onClick={() => onItemToggle(item.itemId, !item.completed)}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
            item.completed
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
              : 'bg-surface hover:bg-surface-hover border border-border text-slate-300'
          )}
        >
          {item.completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Mark Incomplete</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              <span>Mark Topic Complete</span>
            </>
          )}
        </button>

        <button
          onClick={onNextTopic}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/10"
        >
          <span>Next Topic</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

