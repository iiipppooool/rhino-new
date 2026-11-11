'use client';

import { useActionState, useState } from 'react';
import { signIn, requestPasswordReset, type AuthState } from './actions';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

const field =
  'w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted/60 focus:border-blue focus:outline-none';

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [mode, setMode] = useState<'signin' | 'reset'>('signin');
  const [signInState, signInAction, signingIn] = useActionState<AuthState, FormData>(signIn, {
    error: initialError,
  });
  const [resetState, resetAction, resetting] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    {},
  );

  const state = mode === 'signin' ? signInState : resetState;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-9 flex justify-center text-ink">
        <Logo />
      </div>

      <div className="rounded-xl border border-line bg-surface p-7">
        <h1 className="font-display text-2xl">
          {mode === 'signin' ? 'Sign in' : 'Reset your password'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {mode === 'signin'
            ? 'VRhino admin. Accounts are created by an administrator.'
            : 'We will email you a link to set a new password.'}
        </p>

        {state.error && (
          <p role="alert" className="mt-5 rounded-lg border border-accent/60 bg-accent/10 px-4 py-3 text-sm text-ink">
            {state.error}
          </p>
        )}
        {state.notice && (
          <p role="status" className="mt-5 rounded-lg border border-blue/50 bg-blue/10 px-4 py-3 text-sm text-ink">
            {state.notice}
          </p>
        )}

        {mode === 'signin' ? (
          <form action={signInAction} className="mt-6 space-y-4">
            {next && <input type="hidden" name="next" value={next} />}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
              <input id="email" name="email" type="email" autoComplete="username" required className={field} />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
            </div>
            <Button type="submit" disabled={signingIn} className="w-full">
              {signingIn ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <form action={resetAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium">Email</label>
              <input id="reset-email" name="email" type="email" autoComplete="username" required className={field} />
            </div>
            <Button type="submit" disabled={resetting} className="w-full">
              {resetting ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}

        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'reset' : 'signin')}
          className="mt-5 text-sm text-muted underline underline-offset-4 hover:text-ink"
        >
          {mode === 'signin' ? 'Forgot your password?' : 'Back to sign in'}
        </button>
      </div>
    </div>
  );
}
