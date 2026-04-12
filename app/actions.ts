"use server";

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function addMeasurement(formData: FormData) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('vito_auth')?.value === 'true';
  if (!isAuthenticated) throw new Error("Non autorizzato");

  const date = formData.get('date') as string;
  const height = formData.get('height') as string;
  const circumference = formData.get('circumference') as string;

  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    INSERT INTO measurements (date, height_cm, circumference_cm) 
    VALUES (${date}, ${height}, ${circumference})
  `;

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteMeasurement(id: number) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('vito_auth')?.value === 'true';
  if (!isAuthenticated) throw new Error("Non autorizzato");

  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM measurements WHERE id = ${id}`;

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function editMeasurement(formData: FormData) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('vito_auth')?.value === 'true';
  if (!isAuthenticated) throw new Error("Non autorizzato");

  const id = Number(formData.get('id'));
  const date = formData.get('date') as string;
  const height = formData.get('height') as string;
  const circumference = formData.get('circumference') as string;

  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    UPDATE measurements 
    SET date = ${date}, height_cm = ${height}, circumference_cm = ${circumference}
    WHERE id = ${id}
  `;

  revalidatePath('/');
  revalidatePath('/admin');
}

// --- FUNZIONE PER I DATI DEI GRAFICI ---

export async function getMeasurements() {
  if (!process.env.DATABASE_URL) return [];
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`SELECT date, height_cm, circumference_cm FROM measurements ORDER BY date ASC`;
  return data.map((row: any) => ({
    ...row,
    height_cm: Number(row.height_cm),
    circumference_cm: Number(row.circumference_cm),
    date: new Date(row.date).toLocaleDateString('it-IT'),
  }));
}

// --- NUOVE FUNZIONI PER LE IMMAGINI ---

export async function getImages() {
  if (!process.env.DATABASE_URL) return [];
  const sql = neon(process.env.DATABASE_URL);
  // Ritorniamo i dati come array standard
  const data = await sql`SELECT * FROM tree_images ORDER BY created_at DESC`;
  return data;
}

export async function addImage(formData: FormData) {
  const cookieStore = await cookies();
  if (cookieStore.get('vito_auth')?.value !== 'true') throw new Error("Non autorizzato");

  const file = formData.get('image') as File;
  const caption = formData.get('caption') as string;
  const description = formData.get('description') as string;

  if (!file || file.size === 0) throw new Error("Nessun file caricato");

  // Convertiamo il vero file in una stringa di testo (Base64) per salvarlo su Neon
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

  const sql = neon(process.env.DATABASE_URL!);
  // Salviamo la stringa Base64 nella colonna "url" (che è di tipo TEXT)
  await sql`INSERT INTO tree_images (url, caption, description) VALUES (${base64Data}, ${caption}, ${description})`;

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteImage(id: number) {
  const cookieStore = await cookies();
  if (cookieStore.get('vito_auth')?.value !== 'true') throw new Error("Non autorizzato");

  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM tree_images WHERE id = ${id}`;

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function editImage(formData: FormData) {
  const cookieStore = await cookies();
  if (cookieStore.get('vito_auth')?.value !== 'true') throw new Error("Non autorizzato");

  const id = Number(formData.get('id'));
  const caption = formData.get('caption') as string;
  const description = formData.get('description') as string;
  
  const sql = neon(process.env.DATABASE_URL!);
  
  const file = formData.get('image') as File | null;
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
    await sql`
      UPDATE tree_images 
      SET url = ${base64Data}, caption = ${caption}, description = ${description}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      UPDATE tree_images 
      SET caption = ${caption}, description = ${description}
      WHERE id = ${id}
    `;
  }

  revalidatePath('/');
  revalidatePath('/admin');
}