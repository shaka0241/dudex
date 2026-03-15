import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Dudex</h1>
        <p style={{ color: '#6b7280' }}>Únete a la red de confianza</p>
      </div>
      
      <RegisterForm />
      
      <p style={{ marginTop: '1.5rem', color: '#4b5563', fontSize: '14px' }}>
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
