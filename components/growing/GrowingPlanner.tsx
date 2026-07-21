'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Bookmark, CalendarDays, ChevronDown, Clock3, Copy, Droplets,
  Flower2, Heart, Leaf, LoaderCircle, MapPin, RotateCcw, Search, ShoppingCart,
  Sprout, Sun, Trash2, TriangleAlert,
} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';
import { ASSET_BASE_URL, endpoints } from '../../services/apiConfig';
import ConfirmationModal from '../ConfirmationModal';

type Region = { slug: string; name: string; summary: string };
type LocationOption = { id: string; city: string; state: string; region: string; region_name: string };
type Product = {
  id: string; name: string; price: string; category: string; image_url?: string;
  thumbnail_url?: string; stock: number; is_featured?: boolean;
};
type Crop = {
  slug: string; name: string; type: 'vegetable' | 'herb' | 'flower'; summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced'; spaces: string[];
  sunlight: string; watering: string; container: { diameter_cm: number; depth_cm: number };
  sowing: { method: string; depth_cm: number; spacing_cm: number };
  germination_days: [number, number]; harvest_days: [number, number]; instructions: string[];
  common_mistake: string; suitability: 'ideal' | 'possible'; coming_soon: boolean;
  recommended_month: number; why: string; primary_product: Product | null;
  alternative_products: Product[]; support_products: Product[];
  source: { title: string; publisher: string; url: string; reviewed_at: string };
};
type RecommendationResponse = {
  dataset_version: string;
  selection: {
    location: { id: string; city: string; state: string } | null;
    region: Region; month: number; month_name: string; result_month: number;
    result_month_name: string; space: string; type: string; experience: string;
  };
  total_count: number; coming_soon: boolean; recommendations: Crop[];
};
type FilterState = {
  locationId?: string | null; region?: string | null; month: number;
  space: string; type: string; experience: string;
};
type SavedPlan = {
  id: string; name: string; filters: FilterState; crop_slugs: string[];
  dataset_version: string; missing_crop_slugs: string[]; created_at: string;
};

const spaces = [
  { value: 'indoor', label: 'Indoor' }, { value: 'balcony', label: 'Balcony' },
  { value: 'terrace', label: 'Terrace' }, { value: 'garden', label: 'Garden' },
];
const cropTypes = [
  { value: 'vegetable', label: 'Vegetables' }, { value: 'herb', label: 'Herbs' },
  { value: 'flower', label: 'Flowers' },
];
const experiences = [
  { value: 'beginner', label: "I'm a beginner" },
  { value: 'experienced', label: 'I have experience' },
];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentIndiaMonth = () => Number(new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date()));
const validNumber = (value: string | null, fallback: number) => {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 12 ? number : fallback;
};
const productImage = (product: Product | null) => {
  const source = product?.thumbnail_url || product?.image_url;
  if (!source) return '/hero-mobile.webp';
  return source.startsWith('http') ? source : `${ASSET_BASE_URL}${source}`;
};
const formatPrice = (price: string) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(price));
const methodLabel = (method: string) => ({ 'direct-sow': 'Direct sow', nursery: 'Start in nursery', transplant: 'Transplant' }[method] || method);

export default function GrowingPlanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [regions, setRegions] = useState<Region[]>([]);
  const [locationMode, setLocationMode] = useState<'city' | 'region'>(searchParams.get('region') ? 'region' : 'city');
  const [locationId, setLocationId] = useState(searchParams.get('locationId') || '');
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [locationSearch, setLocationSearch] = useState('');
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [month, setMonth] = useState(validNumber(searchParams.get('month'), currentIndiaMonth()));
  const [space, setSpace] = useState(searchParams.get('space') || 'balcony');
  const [type, setType] = useState(searchParams.get('type') || 'vegetable');
  const [experience, setExperience] = useState(searchParams.get('experience') || 'beginner');
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [online, setOnline] = useState(true);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [planName, setPlanName] = useState('');
  const [saving, setSaving] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SavedPlan | null>(null);

  const selectedRegion = useMemo(() => regions.find((item) => item.slug === region), [region, regions]);
  const hasLocation = locationMode === 'city' ? Boolean(locationId) : Boolean(region);

  const loadPlans = useCallback(async () => {
    if (!user) { setSavedPlans([]); return; }
    try {
      const response = await api.get(endpoints.growing.plans);
      setSavedPlans(response.data.plans || []);
    } catch {
      setSavedPlans([]);
    }
  }, [user]);

  useEffect(() => {
    api.get(endpoints.growing.options)
      .then((response) => setRegions(response.data.regions || []))
      .catch(() => setError('The growing guide is temporarily unavailable.'));
  }, []);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  useEffect(() => {
    setOnline(navigator.onLine);
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);
    return () => {
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
    };
  }, []);

  useEffect(() => {
    if (locationSearch.trim().length < 2 || (locationId && !locationOpen)) {
      setLocations([]);
      return;
    }
    const timer = window.setTimeout(() => {
      api.get(endpoints.growing.locations, { params: { search: locationSearch.trim() } })
        .then((response) => setLocations(response.data.locations || []))
        .catch(() => setLocations([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [locationId, locationOpen, locationSearch]);

  useEffect(() => {
    if (!user?.address?.city || locationId || region || locationSearch) return;
    api.get(endpoints.growing.locations, { params: { search: user.address.city } })
      .then((response) => {
        const exact = (response.data.locations || []).find((item: LocationOption) => item.city.toLowerCase() === user.address?.city?.toLowerCase());
        if (exact) {
          setLocationId(exact.id);
          setLocationSearch(`${exact.city}, ${exact.state}`);
          setLocationMode('city');
        }
      })
      .catch(() => undefined);
  }, [locationId, locationSearch, region, user]);

  const filters = useCallback((override?: Partial<FilterState>): FilterState => ({
    locationId: locationMode === 'city' ? locationId || null : null,
    region: locationMode === 'region' ? region || null : null,
    month,
    space,
    type,
    experience,
    ...override,
  }), [experience, locationId, locationMode, month, region, space, type]);

  const runRecommendations = useCallback(async (override?: Partial<FilterState>, updateUrl = true) => {
    const selected = filters(override);
    if (!selected.locationId && !selected.region) {
      setError('Choose a supported city or climate region first.');
      return;
    }
    if (!navigator.onLine) {
      setError('You are offline. Reconnect and try again.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        month: String(selected.month), space: selected.space, type: selected.type,
        experience: selected.experience, limit: '24',
      });
      if (selected.locationId) params.set('locationId', selected.locationId);
      else if (selected.region) params.set('region', selected.region);
      const response = await api.get(`${endpoints.growing.recommendations}?${params.toString()}`);
      setResults(response.data);
      if (response.data.selection.location) {
        setLocationSearch(`${response.data.selection.location.city}, ${response.data.selection.location.state}`);
      }
      localStorage.setItem('green_growing_preferences', JSON.stringify(selected));
      if (updateUrl) router.replace(`/what-to-grow-now?${params.toString()}`, { scroll: false });
    } catch (requestError: any) {
      setResults(null);
      setError(requestError.response?.data?.message || 'Recommendations could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    const queryComplete = (searchParams.get('locationId') || searchParams.get('region'))
      && searchParams.get('month') && searchParams.get('space') && searchParams.get('type') && searchParams.get('experience');
    if (queryComplete) {
      runRecommendations(undefined, false);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem('green_growing_preferences') || 'null') as FilterState | null;
      if (!stored) return;
      setLocationMode(stored.locationId ? 'city' : 'region');
      setLocationId(stored.locationId || '');
      setRegion(stored.region || '');
      setMonth(stored.month || currentIndiaMonth());
      setSpace(stored.space || 'balcony');
      setType(stored.type || 'vegetable');
      setExperience(stored.experience || 'beginner');
    } catch {
      localStorage.removeItem('green_growing_preferences');
    }
    // Initial URL hydration only; later requests are user-driven.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    runRecommendations();
  };

  const reset = () => {
    setLocationMode('city'); setLocationId(''); setRegion(''); setLocationSearch('');
    setMonth(currentIndiaMonth()); setSpace('balcony'); setType('vegetable'); setExperience('beginner');
    setResults(null); setError(''); localStorage.removeItem('green_growing_preferences');
    router.replace('/what-to-grow-now', { scroll: false });
  };

  const savePlan = async () => {
    if (!results) return;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    try {
      setSaving(true);
      await api.post(endpoints.growing.plans, { ...filters(), name: planName.trim() || undefined });
      setPlanName('');
      toast.success('Growing plan saved');
      await loadPlans();
    } catch (saveError: any) {
      toast.error(saveError.response?.data?.message || 'Unable to save this plan');
    } finally {
      setSaving(false);
    }
  };

  const openPlan = (plan: SavedPlan) => {
    const saved = plan.filters;
    setLocationMode(saved.locationId ? 'city' : 'region');
    setLocationId(saved.locationId || ''); setRegion(saved.region || ''); setLocationSearch('');
    setMonth(Number(saved.month)); setSpace(saved.space); setType(saved.type); setExperience(saved.experience);
    runRecommendations(saved);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-3 pb-16 sm:px-6 lg:px-8">
      {!online && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-300" role="status">
          <TriangleAlert className="h-4 w-4" /> You are offline. Your selections are safe; reconnect to load recommendations.
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8">
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-card p-4 shadow-premium sm:p-6 lg:sticky lg:top-28">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Five quick choices</p><h2 className="mt-1 text-2xl font-black text-foreground">Build your growing plan</h2></div>
            <button type="button" onClick={reset} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-gray-400 transition hover:text-primary" aria-label="Reset planner"><RotateCcw className="h-4 w-4" /></button>
          </div>

          <PlannerStep number="1" title="Where are you growing?">
            <div className="mb-3 grid grid-cols-2 rounded-xl bg-background p-1">
              <button type="button" onClick={() => { setLocationMode('city'); setRegion(''); }} className={`rounded-lg px-3 py-2 text-xs font-black transition ${locationMode === 'city' ? 'bg-primary text-white' : 'text-gray-400'}`}>Search city</button>
              <button type="button" onClick={() => { setLocationMode('region'); setLocationId(''); setLocationSearch(''); }} className={`rounded-lg px-3 py-2 text-xs font-black transition ${locationMode === 'region' ? 'bg-primary text-white' : 'text-gray-400'}`}>Choose region</button>
            </div>
            {locationMode === 'city' ? (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <input value={locationSearch} onFocus={() => setLocationOpen(true)} onChange={(event) => { setLocationSearch(event.target.value); setLocationId(''); setLocationOpen(true); }} placeholder="Search city or state" className="h-12 w-full rounded-xl border border-white/10 bg-background pl-10 pr-4 text-sm font-bold text-foreground outline-none focus:border-primary" />
                {locationOpen && locations.length > 0 && (
                  <div className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 max-h-64 overflow-y-auto rounded-xl border border-primary/30 bg-card p-1.5 shadow-premium">
                    {locations.map((item) => <button key={item.id} type="button" onClick={() => { setLocationId(item.id); setLocationSearch(`${item.city}, ${item.state}`); setLocationOpen(false); }} className="w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-primary/10"><strong className="block text-sm text-foreground">{item.city}, {item.state}</strong><span className="text-xs text-gray-400">{item.region_name}</span></button>)}
                  </div>
                )}
              </div>
            ) : (
              <Select value={region} onChange={setRegion} label="Climate region" options={[{ value: '', label: 'Select region' }, ...regions.map((item) => ({ value: item.slug, label: item.name }))]} />
            )}
            {(selectedRegion || results?.selection.region) && locationMode === 'region' && <p className="mt-2 text-xs leading-5 text-gray-400">{(selectedRegion || results?.selection.region)?.summary}</p>}
          </PlannerStep>

          <PlannerStep number="2" title="When do you want to start?"><Select value={String(month)} onChange={(value) => setMonth(Number(value))} label="Month" options={monthNames.map((name, index) => ({ value: String(index + 1), label: name }))} /></PlannerStep>
          <PlannerStep number="3" title="Where will it grow?"><ChoiceGrid options={spaces} value={space} onChange={setSpace} columns="grid-cols-2" /></PlannerStep>
          <PlannerStep number="4" title="What do you want to grow?"><ChoiceGrid options={cropTypes} value={type} onChange={setType} columns="grid-cols-3" /></PlannerStep>
          <PlannerStep number="5" title="Your experience"><ChoiceGrid options={experiences} value={experience} onChange={setExperience} columns="grid-cols-2" /></PlannerStep>

          <button type="submit" disabled={loading || !hasLocation} className="mt-2 hidden h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-45 lg:flex">
            {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sprout className="h-5 w-5" />} Show recommendations
          </button>
        </form>

        <section aria-live="polite" aria-busy={loading}>
          {error && <ErrorState message={error} retry={() => runRecommendations()} />}
          {loading && <ResultsSkeleton />}
          {!loading && !error && !results && <WelcomeState />}
          {!loading && results && <Results result={results} addToCart={addToCart} isWishlisted={isWishlisted} toggleWishlist={toggleWishlist} />}

          {!loading && results && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Keep this selection</p><h3 className="mt-1 text-xl font-black text-foreground">Save or share your plan</h3></div>
                <button type="button" onClick={async () => { await navigator.clipboard.writeText(window.location.href); toast.success('Planner link copied'); }} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 text-sm font-black text-primary hover:bg-primary hover:text-white"><Copy className="h-4 w-4" /> Copy link</button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input value={planName} onChange={(event) => setPlanName(event.target.value)} maxLength={80} placeholder="Plan name (optional)" className="h-12 rounded-xl border border-white/10 bg-background px-4 text-sm font-bold text-foreground outline-none focus:border-primary" />
                <button type="button" onClick={savePlan} disabled={saving} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white disabled:opacity-60"><Bookmark className="h-4 w-4" /> {saving ? 'Saving…' : user ? 'Save plan' : 'Login to save'}</button>
              </div>
            </div>
          )}

          {user && savedPlans.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
              <div className="mb-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Your collection</p><h3 className="mt-1 text-xl font-black text-foreground">Saved growing plans</h3></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {savedPlans.map((plan) => (
                  <article key={plan.id} className="rounded-xl border border-white/10 bg-background p-4">
                    <div className="flex items-start justify-between gap-3"><button type="button" onClick={() => openPlan(plan)} className="min-w-0 text-left"><strong className="block truncate text-sm text-foreground">{plan.name}</strong><span className="mt-1 block text-xs text-gray-400">{plan.crop_slugs.length} crops · {monthNames[Number(plan.filters.month) - 1]}</span></button><button type="button" onClick={() => setPlanToDelete(plan)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400" aria-label={`Delete ${plan.name}`}><Trash2 className="h-4 w-4" /></button></div>
                    {plan.missing_crop_slugs.length > 0 && <p className="mt-2 text-[11px] font-bold text-amber-400">{plan.missing_crop_slugs.length} saved crop is no longer in this guide.</p>}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        <button type="button" disabled={loading || !hasLocation} onClick={() => runRecommendations()} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)] disabled:opacity-45">
          {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sprout className="h-5 w-5" />} Show recommendations
        </button>
      </div>

      <ConfirmationModal isOpen={Boolean(planToDelete)} onClose={() => setPlanToDelete(null)} onConfirm={async () => { if (!planToDelete) return; await api.delete(endpoints.growing.plan(planToDelete.id)); toast.success('Growing plan deleted'); await loadPlans(); }} title="Delete growing plan?" message={planToDelete ? `Delete “${planToDelete.name}”? This cannot be undone.` : 'Delete this saved plan?'} confirmText="Delete plan" />
    </div>
  );
}

function PlannerStep({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <fieldset className="mb-5 border-0 p-0"><legend className="mb-2.5 flex items-center gap-2 text-sm font-black text-foreground"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[11px] text-primary">{number}</span>{title}</legend>{children}</fieldset>;
}

function ChoiceGrid({ options, value, onChange, columns }: { options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; columns: string }) {
  return <div className={`grid gap-2 ${columns}`}>{options.map((option) => <button key={option.value} type="button" onClick={() => onChange(option.value)} aria-pressed={value === option.value} className={`min-h-11 rounded-xl border px-2 py-2 text-xs font-black transition ${value === option.value ? 'border-primary bg-primary text-white shadow-sm' : 'border-white/10 bg-background text-gray-300 hover:border-primary/40 hover:text-primary'}`}>{option.label}</button>)}</div>;
}

function Select({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; label: string }) {
  return <label className="relative block"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-background px-4 pr-10 text-sm font-bold text-foreground outline-none focus:border-primary">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /></label>;
}

function WelcomeState() {
  return <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 sm:p-10"><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/15 blur-3xl" /><div className="relative"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Flower2 className="h-7 w-7" /></div><h2 className="max-w-xl text-2xl font-black text-foreground sm:text-4xl">The right crop begins with the right month.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">Choose your location, space and experience. We will combine reviewed Indian growing guidance with products currently available in the store.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{[[MapPin, 'Region-aware'], [CalendarDays, 'Month-specific'], [ShoppingCart, 'Live products']].map(([Icon, text]) => { const ItemIcon = Icon as typeof MapPin; return <div key={String(text)} className="flex items-center gap-3 rounded-xl bg-background p-4 text-sm font-black text-foreground"><ItemIcon className="h-5 w-5 text-primary" />{String(text)}</div>; })}</div></div></div>;
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-6 text-center"><TriangleAlert className="mx-auto h-9 w-9 text-red-400" /><h2 className="mt-3 text-xl font-black text-foreground">We could not build your plan</h2><p className="mx-auto mt-2 max-w-md text-sm text-gray-400">{message}</p><button type="button" onClick={retry} className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white">Try again</button></div>;
}

function ResultsSkeleton() {
  return <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="animate-pulse rounded-2xl border border-white/10 bg-card p-4"><div className="aspect-[16/9] rounded-xl bg-white/5" /><div className="mt-4 h-6 w-1/2 rounded bg-white/5" /><div className="mt-3 h-4 w-full rounded bg-white/5" /><div className="mt-2 h-4 w-3/4 rounded bg-white/5" /></div>)}</div>;
}

function Results({ result, addToCart, isWishlisted, toggleWishlist }: { result: RecommendationResponse; addToCart: (id: string, quantity: number) => Promise<void>; isWishlisted: (id: string) => boolean; toggleWishlist: (product: Product) => Promise<void> }) {
  return <>
    <header className="mb-5 rounded-2xl border border-white/10 bg-card p-5 sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{result.coming_soon ? `Coming in ${result.selection.result_month_name}` : `Ready for ${result.selection.month_name}`}</p><h2 className="mt-1 text-2xl font-black text-foreground sm:text-3xl">{result.total_count} suitable {result.total_count === 1 ? 'crop' : 'crops'}</h2></div><div className="flex flex-wrap gap-2 text-[11px] font-bold text-gray-300"><span className="rounded-full bg-background px-3 py-1.5">{result.selection.region.name}</span><span className="rounded-full bg-background px-3 py-1.5 capitalize">{result.selection.space}</span><span className="rounded-full bg-background px-3 py-1.5 capitalize">{result.selection.type}</span></div></div>{result.coming_soon && <p className="mt-4 rounded-xl bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-300">No exact matches were found for {result.selection.month_name}. These options use the same filters and become suitable in {result.selection.result_month_name}.</p>}</header>
    {result.recommendations.length ? <div className="grid gap-4 xl:grid-cols-2">{result.recommendations.map((crop) => <CropCard key={crop.slug} crop={crop} addToCart={addToCart} isWishlisted={isWishlisted} toggleWishlist={toggleWishlist} />)}</div> : <div className="rounded-2xl border border-white/10 bg-card p-8 text-center"><Leaf className="mx-auto h-10 w-10 text-primary" /><h3 className="mt-3 text-xl font-black text-foreground">No suitable crops yet</h3><p className="mt-2 text-sm text-gray-400">Try another month, growing space or crop type. Your location was not changed.</p><Link href="/products?category=seeds" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-black text-white">Browse all seeds</Link></div>}
  </>;
}

function CropCard({ crop, addToCart, isWishlisted, toggleWishlist }: { crop: Crop; addToCart: (id: string, quantity: number) => Promise<void>; isWishlisted: (id: string) => boolean; toggleWishlist: (product: Product) => Promise<void> }) {
  const product = crop.primary_product;
  return <article className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-sm">
    <div className="relative aspect-[16/9] overflow-hidden bg-white/5"><Image src={productImage(product)} alt={product ? product.name : crop.name} fill sizes="(max-width: 1279px) 100vw, 50vw" className="object-cover transition duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" /><div className="absolute left-3 top-3 flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white ${crop.suitability === 'ideal' ? 'bg-primary' : 'bg-amber-500'}`}>{crop.coming_soon ? `Coming ${monthNames[crop.recommended_month - 1]}` : crop.suitability === 'ideal' ? 'Ideal this month' : 'Possible this month'}</span><span className="rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-black capitalize text-white backdrop-blur">{crop.difficulty}</span></div><div className="absolute inset-x-4 bottom-4"><h3 className="text-2xl font-black text-white">{crop.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75">{crop.summary}</p></div></div>
    <div className="p-4 sm:p-5"><p className="rounded-xl bg-primary/10 px-3 py-2.5 text-xs font-bold leading-5 text-primary">{crop.why}</p><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><Fact icon={Sun} label="Light" value={crop.sunlight} /><Fact icon={Droplets} label="Water" value={crop.watering} /><Fact icon={Sprout} label="Start" value={methodLabel(crop.sowing.method)} /><Fact icon={Clock3} label="Timeline" value={`${crop.germination_days[0]}–${crop.germination_days[1]}d germination · ${crop.harvest_days[0]}–${crop.harvest_days[1]}d ${crop.type === 'flower' ? 'flowering' : 'harvest'}`} /></div><p className="mt-3 text-xs font-bold text-gray-400">Container: at least {crop.container.diameter_cm} cm wide × {crop.container.depth_cm} cm deep · Sow {crop.sowing.depth_cm} cm deep · Space {crop.sowing.spacing_cm} cm</p>
      <details className="group mt-4 rounded-xl border border-white/10 bg-background"><summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-black text-foreground">How to start <ChevronDown className="h-4 w-4 transition group-open:rotate-180" /></summary><div className="border-t border-white/10 px-4 py-4"><ol className="space-y-2">{crop.instructions.map((step, index) => <li key={step} className="flex gap-3 text-xs leading-5 text-gray-300"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-black text-primary">{index + 1}</span>{step}</li>)}</ol><div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200"><strong>Common mistake:</strong> {crop.common_mistake}</div><a href={crop.source.url} target="_blank" rel="noreferrer" className="mt-3 block text-[11px] font-bold text-gray-500 hover:text-primary">Guidance: {crop.source.publisher} · reviewed {crop.source.reviewed_at}</a></div></details>
      {product ? <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3"><div className="flex items-center gap-3"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5"><Image src={productImage(product)} alt={product.name} fill sizes="64px" className="object-cover" /></div><div className="min-w-0 flex-1"><Link href={`/products/${product.id}`} className="line-clamp-2 text-sm font-black text-foreground hover:text-primary">{product.name}</Link><div className="mt-1 flex items-center justify-between gap-2"><span className="text-sm font-black text-primary">{formatPrice(product.price)}</span><span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>{product.stock > 0 ? 'In stock' : 'Unavailable'}</span></div></div><button type="button" onClick={() => toggleWishlist(product)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isWishlisted(product.id) ? 'bg-primary text-white' : 'bg-background text-gray-400 hover:text-primary'}`} aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}><Heart className={`h-4 w-4 ${isWishlisted(product.id) ? 'fill-current' : ''}`} /></button></div><button type="button" onClick={() => addToCart(product.id, 1)} disabled={product.stock <= 0} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-black text-white disabled:bg-white/10 disabled:text-gray-500"><ShoppingCart className="h-4 w-4" />{product.stock > 0 ? 'Add to cart' : 'Currently unavailable'}</button></div> : <div className="mt-4 rounded-xl border border-dashed border-white/15 p-4 text-center text-xs font-bold text-gray-400">Growing guidance is available, but a matching store product is not currently listed.</div>}
      {crop.alternative_products.length > 0 && <div className="mt-4"><p className="mb-2 text-[10px] font-black uppercase tracking-wider text-gray-500">Alternatives</p><div className="flex flex-wrap gap-2">{crop.alternative_products.map((item) => <Link key={item.id} href={`/products/${item.id}`} className="rounded-lg bg-background px-3 py-2 text-xs font-bold text-gray-300 hover:text-primary">{item.name}</Link>)}</div></div>}
      {crop.support_products.length > 0 && <div className="mt-4"><p className="mb-2 text-[10px] font-black uppercase tracking-wider text-gray-500">Helpful planter & tools</p><div className="grid gap-2">{crop.support_products.map((item) => <Link key={item.id} href={`/products/${item.id}`} className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2 text-xs font-bold text-gray-300 hover:text-primary"><span className="line-clamp-1">{item.name}</span><span className="shrink-0 text-primary">{formatPrice(item.price)}</span></Link>)}</div></div>}
    </div>
  </article>;
}

function Fact({ icon: Icon, label, value }: { icon: typeof Sun; label: string; value: string }) {
  return <div className="rounded-xl bg-background p-3"><Icon className="mb-2 h-4 w-4 text-primary" /><strong className="block text-[10px] uppercase tracking-wider text-gray-500">{label}</strong><span className="mt-1 block leading-5 text-gray-300">{value}</span></div>;
}
