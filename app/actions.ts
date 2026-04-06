"use server"; // Indica a Next.js che questo codice gira SOLO sul server (sicuro per le password del DB)

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function addMeasurement(formData: FormData) {
  // 1. Controlla se chi sta inviando i dati è loggato
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorizzato");

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

  // 4. Aggiorna le pagine per mostrare i nuovi dati in tempo reale
  revalidatePath('/dashboard');
  revalidatePath('/admin');
}

export async function deleteMeasurement(id: number) {
 const { userId } = await auth();;
  if (!userId) throw new Error("Non autorizzato");

  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM measurements WHERE id = ${id}`;

  revalidatePath('/dashboard');
  revalidatePath('/admin');
}