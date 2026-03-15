import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Dudex</h1>
        <p style={{ color: '#6b7280' }}>El Buró de Confianza del Comercio</p>
      </div>
      
      <LoginForm />
      
      <p style={{ marginTop: '1.5rem', color: '#4b5563', fontSize: '14px' }}>
        ¿No tienes cuenta?{' '}
        <Link href="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
