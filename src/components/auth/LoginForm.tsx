'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import styles from './AuthForms.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push('/'); // Redirect a dashboard o home
          router.refresh();
        },
        onError: (ctx) => {
          // Extraemos el mensaje de error de Better Auth
          setError(ctx.error.message || 'Error al iniciar sesión');
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@correo.com"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        
        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Iniciando...' : 'Entrar a Dudex'}
        </button>
      </form>
    </div>
  );
}
