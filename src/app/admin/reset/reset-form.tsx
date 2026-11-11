'use client';

import { useActionState } from 'react';
import { setNewPassword, type ResetState } from './actions';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

const field =
  'w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink focus:border-blue focus:outline-none';

export function ResetForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(setNewPassword, {});

  return (
    <div className="w-full max-w-sm">
      <div className="mb-9 flex justify-center text-ink">
        <Logo />
      </div>

      <div className="rounded-xl border border-line bg-surface p-7">
        <h1 className="font-display text-2xl">Set a new password</h1>
        <p className="mt-2 text-sm text-muted">
          For <span className="text-ink">{email}</span>
        </p>

        {state.error && (
          <p role="alert" className="mt-5 rounded-lg border border-accent/60 bg-accent/10 px-4 py-3 text-sm text-ink">
            {state.error}
          </p>
        )}

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">New password</label>
            <input id="password" name="password" type="password" autoComplete="new-password"
              required minLength={12} className={field} />
            <p className="mt-1.5 text-xs text-muted">At least 12 characters.</p>
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">Confirm password</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password"
              required minLength={12} className={field} />
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Saving…' : 'Save new password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
