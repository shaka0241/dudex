'use client';

import { useState } from 'react';
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import styles from './AuthForms.module.css';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: () => {
          router.push('/'); // Ya estará logeado (autoSignIn: true en auth.ts)
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Error al crear la cuenta');
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Crear Cuenta</h2>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre de Comercio / Negocio</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej. Bodega La Bendición"
          />
        </div>

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
          {isLoading ? 'Creando cuenta...' : 'Unirse a Dudex'}
        </button>
      </form>
    </div>
  );
}
