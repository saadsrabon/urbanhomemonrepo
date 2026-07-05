import { Suspense } from 'react';
import { AppointmentForm } from './AppointmentForm';

export default function AppointmentPage() {
  return (
    <Suspense fallback={<section className="py-20 px-4 text-center text-slate-500">Loading...</section>}>
      <AppointmentForm />
    </Suspense>
  );
}
