'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Tv, Wine, UtensilsCrossed, Music, Sparkles, Plus, Pencil, Trash2,
  X, Save, Star, Eye, EyeOff, ArrowUp, ArrowDown, ExternalLink,
  RotateCcw, Instagram, Facebook, ImageIcon, Loader2,
  HelpCircle, ChevronDown,
} from 'lucide-react';
import {
  type WhatsOnItem,
  type WhatsOnCategory,
  type WhatsOnStatus,
  WHATS_ON_CATEGORIES,
} from '@/lib/whatsOn';

const categoryIcons: Record<WhatsOnCategory, React.ElementType> = {
  screen: Tv,
  offer: Wine,
  dining: UtensilsCrossed,
  music: Music,
  special: Sparkles,
};

const inputClass =
  'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent transition';

interface FormState {
  id: string;
  title: string;
  category: WhatsOnCategory;
  status: WhatsOnStatus;
  featured: boolean;
  subtitle: string;
  badge: string;
  description: string;
  schedule: string;
  instagramUrl: string;
  facebookEventUrl: string;
  trackTeam: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

function blankForm(): FormState {
  return {
    id: '',
    title: '',
    category: 'special',
    status: 'draft',
    featured: false,
    subtitle: '',
    badge: '',
    description: '',
    schedule: '',
    instagramUrl: '',
    facebookEventUrl: '',
    trackTeam: '',
    imageUrl: '',
    ctaLabel: '',
    ctaUrl: '',
  };
}

function toForm(item: WhatsOnItem): FormState {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    status: item.status,
    featured: item.featured,
    subtitle: item.subtitle || '',
    badge: item.badge || '',
    description: item.description || '',
    schedule: item.schedule || '',
    instagramUrl: item.instagramUrl || '',
    facebookEventUrl: item.facebookEventUrl || '',
    trackTeam: item.trackTeam || '',
    imageUrl: item.imageUrl || '',
    ctaLabel: item.ctaLabel || '',
    ctaUrl: item.ctaUrl || '',
  };
}

export default function WhatsOnManager({ token }: { token: string }) {
  const [items, setItems] = useState<WhatsOnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whats-on?all=1', { headers: authHeaders() });
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = async (id: string, updates: Partial<WhatsOnItem>) => {
    setBusyId(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    try {
      await fetch('/api/whats-on', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id, ...updates }),
      });
    } finally {
      setBusyId(null);
    }
  };

  const move = async (item: WhatsOnItem, dir: -1 | 1) => {
    const ordered = [...items].sort((a, b) => a.order - b.order);
    const idx = ordered.findIndex((i) => i.id === item.id);
    const swapWith = ordered[idx + dir];
    if (!swapWith) return;
    const a = { ...item, order: swapWith.order };
    const b = { ...swapWith, order: item.order };
    setItems((prev) =>
      prev.map((i) => (i.id === a.id ? a : i.id === b.id ? b : i))
    );
    await Promise.all([
      fetch('/api/whats-on', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: a.id, order: a.order }),
      }),
      fetch('/api/whats-on', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: b.id, order: b.order }),
      }),
    ]);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/whats-on?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  };

  const resetDefaults = async () => {
    if (
      !confirm(
        'Reset What\u2019s On back to the original starter content? Any items you have added or edited will be lost.'
      )
    )
      return;
    setLoading(true);
    await fetch('/api/whats-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ reset: true }),
    });
    await load();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.title.trim()) return;
    setSaving(true);
    try {
      const isNew = !form.id;
      const res = await fetch('/api/whats-on', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm(null);
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const ordered = [...items].sort((a, b) => a.order - b.order);
  const published = items.filter((i) => i.status === 'published').length;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#2d4a4a] flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#c9a55c]" /> What&rsquo;s On Manager
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {published} live · {items.length} total. Changes appear on the
              website instantly — no code needed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/upcoming"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-[#2d4a4a] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View page
            </a>
            <button
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Reset to starter content"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={() => setForm(blankForm())}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add item
            </button>
          </div>
        </div>
        {/* How-to guide for staff */}
        <div className="mt-4 bg-[#f8f6f1] rounded-xl overflow-hidden border border-[#c9a55c]/20">
          <button
            type="button"
            onClick={() => setShowHelp((s) => !s)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-[#2d4a4a]">
              <HelpCircle className="w-4 h-4 text-[#c9a55c]" />
              How to update What&rsquo;s On
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showHelp ? 'rotate-180' : ''
              }`}
            />
          </button>
          {showHelp && (
            <div className="px-4 pb-4 pt-1 text-sm text-gray-600 space-y-2.5">
              <p className="text-gray-500">
                No code needed — every change here updates the live website
                straight away.
              </p>
              <ol className="space-y-2.5">
                <HelpStep n={1}>
                  <strong className="text-[#2d4a4a]">Add something new:</strong>{' '}
                  click <em>Add item</em>, type a title and a short description,
                  pick a category, then turn on <em>Live on website</em>.
                </HelpStep>
                <HelpStep n={2}>
                  <strong className="text-[#2d4a4a]">Show or hide:</strong> tap
                  the <Eye className="inline w-3.5 h-3.5 text-green-600 mx-0.5" />
                  eye. Hidden items stay saved but don&rsquo;t appear on the
                  site — perfect for things you&rsquo;re not advertising yet.
                </HelpStep>
                <HelpStep n={3}>
                  <strong className="text-[#2d4a4a]">Feature it:</strong> the{' '}
                  <Star className="inline w-3.5 h-3.5 text-[#c9a55c] fill-[#c9a55c] mx-0.5" />
                  star puts an item in the big banner and the highlight chips at
                  the top of the page.
                </HelpStep>
                <HelpStep n={4}>
                  <strong className="text-[#2d4a4a]">Reorder:</strong> use the{' '}
                  <ArrowUp className="inline w-3.5 h-3.5 mx-0.5" />
                  <ArrowDown className="inline w-3.5 h-3.5 mx-0.5" />
                  arrows to move items up or down.
                </HelpStep>
                <HelpStep n={5}>
                  <strong className="text-[#2d4a4a]">Add an Instagram reel:</strong>{' '}
                  on Instagram open the reel, tap <em>Share → Copy link</em>, and
                  paste it into the Instagram field. It embeds on the page
                  automatically.
                </HelpStep>
                <HelpStep n={6}>
                  <strong className="text-[#2d4a4a]">Link a Facebook event:</strong>{' '}
                  paste the event&rsquo;s link into the Facebook field — great
                  for big match days like the England game.
                </HelpStep>
                <HelpStep n={7}>
                  <strong className="text-[#2d4a4a]">Add a photo:</strong> paste
                  an image link into the Image field (or use a site image such
                  as <code className="text-xs bg-white px-1 py-0.5 rounded">/dome.jpeg</code>).
                </HelpStep>
              </ol>
              <p className="flex items-start gap-2 text-xs text-gray-500 pt-1 border-t border-[#c9a55c]/15 mt-1">
                <RotateCcw className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Reset</strong> restores the original starter content if
                  you ever want to start fresh.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {ordered.map((item, idx) => {
            const Icon = categoryIcons[item.category];
            const live = item.status === 'published';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-3 sm:gap-4 transition-shadow hover:shadow-md ${
                  live
                    ? 'border-gray-100'
                    : 'border-dashed border-gray-200 bg-gray-50/60'
                }`}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => move(item, -1)}
                    disabled={idx === 0}
                    className="p-1 text-gray-300 hover:text-[#2d4a4a] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(item, 1)}
                    disabled={idx === ordered.length - 1}
                    className="p-1 text-gray-300 hover:text-[#2d4a4a] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Icon */}
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    live ? 'bg-[#2d4a4a]' : 'bg-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#c9a55c]" />
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-[#2d4a4a] truncate">
                      {item.title || 'Untitled'}
                    </p>
                    {item.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-bold text-[#9c7e3f] bg-[#c9a55c]/15 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-[#c9a55c] text-[#c9a55c]" /> Featured
                      </span>
                    )}
                    {!live && (
                      <span className="text-[10px] uppercase tracking-wide font-bold text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {WHATS_ON_CATEGORIES.find((c) => c.key === item.category)?.label}
                    {item.schedule ? ` · ${item.schedule}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.instagramUrl && (
                      <Instagram className="w-3.5 h-3.5 text-[#d62976]" />
                    )}
                    {item.facebookEventUrl && (
                      <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                    )}
                    {item.imageUrl && (
                      <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  <button
                    onClick={() =>
                      patch(item.id, { status: live ? 'draft' : 'published' })
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      live
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={live ? 'Hide from website' : 'Show on website'}
                  >
                    {busyId === item.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : live ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => patch(item.id, { featured: !item.featured })}
                    className={`p-2 rounded-lg transition-colors ${
                      item.featured
                        ? 'text-[#c9a55c] hover:bg-[#c9a55c]/10'
                        : 'text-gray-300 hover:bg-gray-100'
                    }`}
                    title={item.featured ? 'Unfeature' : 'Feature in hero'}
                  >
                    <Star className={`w-5 h-5 ${item.featured ? 'fill-[#c9a55c]' : ''}`} />
                  </button>
                  <button
                    onClick={() => setForm(toForm(item))}
                    className="p-2 text-gray-400 hover:text-[#2d4a4a] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
          {ordered.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
              No items yet. Click &ldquo;Add item&rdquo; to create your first one.
            </div>
          )}
        </div>
      )}

      {/* Editor modal */}
      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !saving && setForm(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="bg-[#2d4a4a] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="font-semibold text-lg">
                {form.id ? 'Edit item' : 'New item'}
              </h2>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. England — The Big One"
                  className={inputClass}
                  autoFocus
                  required
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as WhatsOnCategory })
                    }
                    className={inputClass}
                  >
                    {WHATS_ON_CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Badge (small pill)">
                  <input
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. 2-for-1 · On now"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Subtitle (eyebrow line)">
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. This Saturday"
                  className={inputClass}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Tell guests what to expect…"
                  className={inputClass}
                />
              </Field>

              <Field label="Schedule / when">
                <input
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  placeholder="e.g. Fridays · 5–9pm"
                  className={inputClass}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Instagram reel / post link"
                  icon={<Instagram className="w-3.5 h-3.5 text-[#d62976]" />}
                >
                  <input
                    value={form.instagramUrl}
                    onChange={(e) =>
                      setForm({ ...form, instagramUrl: e.target.value })
                    }
                    placeholder="https://www.instagram.com/reel/…"
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Facebook event link"
                  icon={<Facebook className="w-3.5 h-3.5 text-[#1877F2]" />}
                >
                  <input
                    value={form.facebookEventUrl}
                    onChange={(e) =>
                      setForm({ ...form, facebookEventUrl: e.target.value })
                    }
                    placeholder="https://www.facebook.com/events/…"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                label="Auto-update with live fixtures"
                icon={<Tv className="w-3.5 h-3.5 text-[#c9a55c]" />}
              >
                <select
                  value={form.trackTeam}
                  onChange={(e) => setForm({ ...form, trackTeam: e.target.value })}
                  className={inputClass}
                >
                  <option value="">No — just use the text above</option>
                  <option value="england">
                    England (men&rsquo;s football) — shows the next match live
                  </option>
                </select>
              </Field>

              <Field
                label="Image URL (optional)"
                icon={<ImageIcon className="w-3.5 h-3.5 text-gray-400" />}
              >
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/dome.jpeg or https://…"
                  className={inputClass}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Button label">
                  <input
                    value={form.ctaLabel}
                    onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                    placeholder="e.g. Book a table"
                    className={inputClass}
                  />
                </Field>
                <Field label="Button link">
                  <input
                    value={form.ctaUrl}
                    onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Toggle
                  active={form.status === 'published'}
                  onClick={() =>
                    setForm({
                      ...form,
                      status: form.status === 'published' ? 'draft' : 'published',
                    })
                  }
                  onLabel="Live on website"
                  offLabel="Hidden (draft)"
                  onIcon={<Eye className="w-4 h-4" />}
                  offIcon={<EyeOff className="w-4 h-4" />}
                />
                <Toggle
                  active={form.featured}
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  onLabel="Featured"
                  offLabel="Not featured"
                  onIcon={<Star className="w-4 h-4 fill-current" />}
                  offIcon={<Star className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.title.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {form.id ? 'Save changes' : 'Create item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function HelpStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2d4a4a] text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function Field({
  label, children, icon,
}: { label: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  active, onClick, onLabel, offLabel, onIcon, offIcon,
}: {
  active: boolean;
  onClick: () => void;
  onLabel: string;
  offLabel: string;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
        active
          ? 'bg-[#2d4a4a] text-white border-[#2d4a4a]'
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
      }`}
    >
      {active ? onIcon : offIcon}
      {active ? onLabel : offLabel}
    </button>
  );
}
