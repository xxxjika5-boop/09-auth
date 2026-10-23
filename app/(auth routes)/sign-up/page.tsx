'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import css from './page.module.css';

import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function SignUpPage() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: register,

    onSuccess: (user) => {
      setUser(user);
      router.push('/profile');
    },

    onError: () => {
      setError('Registration failed');
    },
  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError('');

    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form
        className={css.form}
        onSubmit={handleSubmit}
      >
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? 'Loading...'
              : 'Register'}
          </button>
        </div>

        {error && (
          <p className={css.error}>{error}</p>
        )}
      </form>
    </main>
  );
}