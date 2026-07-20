'use client';

import { useMemo, useState } from 'react';
import { Camera, CheckCircle2, PackageCheck, RotateCcw, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { endpoints } from '../services/apiConfig';

const reasons = [
  ['damaged', 'Damaged'],
  ['dead', 'Plant arrived dead'],
  ['defective', 'Defective'],
  ['missing', 'Missing item'],
  ['wrong_item', 'Wrong item'],
  ['not_as_described', 'Not as described'],
  ['change_of_mind', 'Changed my mind'],
];

const moneyPaise = (value: string | number | undefined) => `₹${(Number(value || 0) / 100).toFixed(2)}`;
const dateTime = (value?: string) => value ? new Date(value).toLocaleString() : '-';

const reasonsForItem = (item: any) => {
  if (item.category === 'plants' || item.final_sale || item.return_policy === 'damage_only') {
    return reasons.filter(([value]) => (
      ['damaged', 'dead', 'missing', 'wrong_item'].includes(value)
      && (value !== 'dead' || item.category === 'plants')
    ));
  }
  return reasons.filter(([value]) => value !== 'dead');
};

function ReturnTimeline({ request, onChanged }: { request: any; onChanged: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  const withdraw = async () => {
    try {
      setBusy(true);
      await api.post(endpoints.returns.cancel(request.id), { note: 'Withdrawn by customer' });
      toast.success('Return request withdrawn');
      await onChanged();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to withdraw return');
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="min-w-0 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all text-xs font-black uppercase tracking-[0.18em] text-primary">{request.request_number}</p>
          <h4 className="mt-1 text-lg font-black capitalize text-foreground">{String(request.status).replaceAll('_', ' ')}</h4>
          <p className="text-xs font-bold text-gray-500">Requested {dateTime(request.created_at)}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase text-primary">{request.preferred_resolution}</span>
      </div>

      <div className="mt-4 grid gap-2">
        {request.items?.map((item: any) => (
          <div key={item.id} className="flex min-w-0 flex-col gap-2 rounded-xl bg-card p-3 text-sm min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
            <div className="min-w-0">
              <strong className="break-words">{item.product_name}</strong>
              <p className="text-xs capitalize text-gray-500">{String(item.reason).replaceAll('_', ' ')} · Qty {item.quantity}</p>
            </div>
            <strong className="shrink-0 text-primary">{moneyPaise(item.requested_amount_paise)}</strong>
          </div>
        ))}
      </div>

      {!!request.shipments?.length && (
        <div className="mt-4 space-y-3">
          {request.shipments.map((shipment: any) => (
            <div key={shipment.id} className="min-w-0 rounded-xl border border-black/5 bg-card p-4 dark:border-white/10">
              <p className="break-words text-xs font-black uppercase text-primary">{shipment.direction} {shipment.purpose} · {shipment.status}</p>
              {shipment.packages?.map((pkg: any) => (
                <div key={pkg.id} className="mt-2 min-w-0 text-sm">
                  <strong className="break-all">AWB {pkg.waybill || 'Pending'}</strong>
                  <p className="break-words text-xs text-gray-500">{pkg.status_description || pkg.status}{pkg.status_location ? ` · ${pkg.status_location}` : ''}</p>
                  {pkg.events?.slice(0, 4).map((event: any) => (
                    <p key={event.id} className="mt-2 break-words border-l-2 border-primary/30 pl-3 text-xs text-gray-500">
                      <strong className="text-foreground">{event.status}</strong><br />
                      {dateTime(event.occurred_at)}{event.location ? ` · ${event.location}` : ''}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          ['Inspection', request.inspection_status],
          ['Resolution', request.resolution_type || 'Pending'],
          ['Refund', request.refunds?.at(-1)?.status || 'Not started'],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-xl bg-card p-3">
            <p className="text-[10px] font-black uppercase text-gray-500">{label}</p>
            <strong className="break-words capitalize">{value}</strong>
          </div>
        ))}
      </div>

      {request.refunds?.map((refund: any) => (
        <div key={refund.id} className="mt-3 min-w-0 rounded-xl border border-black/5 bg-card p-3 text-sm dark:border-white/10">
          <div className="flex flex-wrap justify-between gap-2">
            <strong>{moneyPaise(refund.amount_paise)}</strong>
            <span className="font-black capitalize text-primary">{refund.status}</span>
          </div>
          <p className="mt-1 break-all text-xs text-gray-500">{refund.razorpay_refund_id || refund.receipt}{refund.arn ? ` · ARN ${refund.arn}` : ''}</p>
          {refund.status === 'pending' && <p className="mt-2 text-xs font-bold text-gray-500">Normal refunds generally reach the original payment method within 5–7 working days.</p>}
          {refund.failure_message && <p className="mt-2 text-xs font-bold text-red-600">Support is reviewing this refund.</p>}
        </div>
      ))}

      {request.admin_reason && <p className="mt-4 break-words rounded-xl bg-card p-3 text-sm font-bold text-foreground">Admin note: {request.admin_reason}</p>}
      {['requested', 'approved'].includes(request.status) && !request.shipments?.length && (
        <button disabled={busy} onClick={withdraw} className="mt-4 w-full cursor-pointer rounded-xl bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 disabled:opacity-50 sm:w-auto">
          Withdraw request
        </button>
      )}
    </article>
  );
}

export default function OrderReturns({ order, onChanged }: { order: any; onChanged: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [explanation, setExplanation] = useState('');
  const [resolution, setResolution] = useState<'refund' | 'replacement'>('refund');
  const [selection, setSelection] = useState<Record<string, { selected: boolean; quantity: number; reason: string }>>(() => (
    Object.fromEntries((order.items || []).map((item: any) => [
      item.id,
      { selected: false, quantity: 1, reason: item.category === 'plants' ? 'damaged' : 'change_of_mind' },
    ]))
  ));
  const selected = useMemo(() => (
    (order.items || []).filter((item: any) => selection[item.id]?.selected)
  ), [order.items, selection]);
  const canRequest = order.status === 'delivered' && ['paid', 'partially_refunded'].includes(order.payment_status);

  const submit = async () => {
    if (!selected.length) return toast.error('Select at least one item');
    try {
      setSubmitting(true);
      let evidence: any[] = [];
      if (files.length) {
        const form = new FormData();
        files.forEach((file) => form.append('evidence', file));
        const upload = await api.post(endpoints.returns.evidence, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        evidence = upload.data.evidence;
      }
      const response = await api.post(endpoints.returns.create(order.id), {
        preferred_resolution: resolution,
        explanation,
        evidence,
        items: selected.map((item: any) => ({
          order_item_id: item.id,
          quantity: selection[item.id].quantity,
          reason: selection[item.id].reason,
        })),
      });
      toast.success(response.data.message || 'Return request submitted');
      setOpen(false);
      setFiles([]);
      await onChanged();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-w-0 rounded-2xl border border-black/5 bg-card p-4 dark:border-white/10 sm:p-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 font-black text-foreground"><RotateCcw className="h-5 w-5 shrink-0 text-primary" /> Returns & refunds</h3>
          <p className="mt-1 text-sm text-gray-500">Track return pickup, inspection, refund, or replacement.</p>
        </div>
        {canRequest && (
          <button onClick={() => setOpen((value) => !value)} className="w-full cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white sm:w-auto">
            {open ? 'Close form' : 'Request return'}
          </button>
        )}
      </div>

      {open && (
        <div className="mt-5 min-w-0 space-y-4 rounded-2xl border border-primary/15 bg-primary/5 p-3 sm:p-4">
          <div className="grid gap-3">
            {order.items?.map((item: any) => {
              const current = selection[item.id];
              return (
                <div key={item.id} className="grid min-w-0 gap-3 rounded-xl bg-card p-3 sm:p-4 md:grid-cols-[auto_minmax(0,1fr)_100px_180px] md:items-center">
                  <label className="flex items-center gap-2 text-sm font-bold md:block">
                    <input type="checkbox" checked={current?.selected || false} onChange={(event) => setSelection({ ...selection, [item.id]: { ...current, selected: event.target.checked } })} />
                    <span className="md:sr-only">Select item</span>
                  </label>
                  <div className="min-w-0">
                    <strong className="break-words">{item.product_name}</strong>
                    <p className="text-xs text-gray-500">Purchased: {item.quantity} · {item.category}</p>
                  </div>
                  <input aria-label="Return quantity" type="number" min="1" max={item.quantity} value={current?.quantity || 1} onChange={(event) => setSelection({ ...selection, [item.id]: { ...current, quantity: Number(event.target.value) } })} className="w-full rounded-lg border border-black/10 bg-background px-3 py-2 dark:border-white/10" />
                  <select aria-label="Return reason" value={current?.reason} onChange={(event) => setSelection({ ...selection, [item.id]: { ...current, reason: event.target.value } })} className="w-full rounded-lg border border-black/10 bg-background px-3 py-2 dark:border-white/10">
                    {reasonsForItem(item).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              );
            })}
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-black text-foreground">
              Preferred outcome
              <select value={resolution} onChange={(event) => setResolution(event.target.value as 'refund' | 'replacement')} className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 dark:border-white/10">
                <option value="refund">Refund</option>
                <option value="replacement">Same-item replacement</option>
              </select>
            </label>
            <label className="min-w-0 text-sm font-black text-foreground">
              Evidence photos
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 5))} className="mt-2 block w-full min-w-0 rounded-xl border border-black/10 bg-background px-3 py-3 text-xs dark:border-white/10" />
            </label>
          </div>
          <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} maxLength={2000} rows={3} placeholder="Describe the issue and condition of the packaging" className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 dark:border-white/10" />
          <p className="flex items-start gap-2 text-xs font-bold text-gray-500"><Camera className="mt-0.5 h-4 w-4 shrink-0" /> Damage, missing-item, and wrong-item claims require at least two clear product and packaging photos.</p>
          <button disabled={submitting || !selected.length} onClick={submit} className="w-full cursor-pointer rounded-xl bg-primary px-5 py-3 font-black text-white disabled:opacity-50 sm:w-auto">
            {submitting ? 'Submitting...' : 'Submit return request'}
          </button>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {order.refunds?.filter((refund: any) => !refund.return_request_id).map((refund: any) => (
          <div key={refund.id} className="min-w-0 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/15 dark:text-amber-200">
            <div className="flex flex-wrap justify-between gap-3"><strong>Order refund · {moneyPaise(refund.amount_paise)}</strong><span className="font-black capitalize">{refund.status}</span></div>
            <p className="mt-1 break-all text-xs">{refund.razorpay_refund_id || refund.receipt}{refund.arn ? ` · ARN ${refund.arn}` : ''}</p>
            {refund.status === 'pending' && <p className="mt-2 text-xs font-bold">Normal refunds generally reach the original payment method within 5–7 working days.</p>}
          </div>
        ))}
        {order.returns?.map((request: any) => <ReturnTimeline key={request.id} request={request} onChanged={onChanged} />)}
        {!order.returns?.length && !order.refunds?.length && (
          <div className="grid grid-cols-1 gap-3 text-center text-xs font-bold text-gray-500 sm:grid-cols-3">
            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5"><Truck className="mx-auto mb-2 h-5 w-5 text-primary" />Pickup</div>
            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5"><PackageCheck className="mx-auto mb-2 h-5 w-5 text-primary" />Inspection</div>
            <div className="rounded-xl bg-black/5 p-3 dark:bg-white/5"><CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-primary" />Resolution</div>
          </div>
        )}
      </div>
    </section>
  );
}
