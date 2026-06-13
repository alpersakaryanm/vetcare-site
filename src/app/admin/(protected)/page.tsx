import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    appointmentsCount,
    servicesCount,
    vetsCount,
    blogCount
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.service.count(),
    prisma.veterinarian.count(),
    prisma.blogPost.count(),
  ]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the VetClinic Administration Panel.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '32px' }}>
        <div style={{ padding: '24px', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '8px' }}>Appointments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{appointmentsCount}</p>
        </div>
        <div style={{ padding: '24px', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '8px' }}>Services</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{servicesCount}</p>
        </div>
        <div style={{ padding: '24px', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '8px' }}>Veterinarians</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{vetsCount}</p>
        </div>
        <div style={{ padding: '24px', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '8px' }}>Blog Posts</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{blogCount}</p>
        </div>
      </div>
    </div>
  );
}
