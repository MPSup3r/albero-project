"use server";

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function addMeasurement(formData: FormData) {
  // 1. Controlla se chi sta inviando i dati ha il cookie di login
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('vito_auth')?.value === 'true';
  
  if (!isAuthenticated) throw new Error("Non autorizzato");

  // 2. Prendi i dati dal form
  const date = formData.get('date') as string;
  const height = formData.get('height') as string;
  const circumference = formData.get('circumference') as string;

  // 3. Salva nel database
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    INSERT INTO measurements (date, height_cm, circumference_cm) 
    VALUES (${date}, ${height}, ${circumference})
  `;

  // 4. Aggiorna le pagine
  revalidatePath('/dashboard');
  revalidatePath('/admin');
}

export async function deleteMeasurement(id: number) {
  // Controllo sicurezza anche qui
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('vito_auth')?.value === 'true';
  
  if (!isAuthenticated) throw new Error("Non autorizzato");

  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM measurements WHERE id = ${id}`;

  revalidatePath('/dashboard');
  revalidatePath('/admin');
}