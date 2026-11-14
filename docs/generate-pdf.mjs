import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shots = path.join(root, 'docs', 'screenshots');
const repoUrl = process.env.GITHUB_REPO_URL ?? 'https://github.com/icarlosaroche/PhotoAuthApp';

const images = [
  ['01-inicio-sesion.jpg', 'Inicio de sesión en el dispositivo (Expo Go)'],
  ['02-pantalla-principal-camara.jpg', 'Pantalla principal con fotografía capturada con la cámara'],
];

const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

function addWrappedText(page, text, x, y, size, maxWidth, typeFont, color) {
  const words = text.split(' ');
  let line = '';
  let cursor = y;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (typeFont.widthOfTextAtSize(next, size) > maxWidth) {
      page.drawText(line, { x, y: cursor, size, font: typeFont, color });
      cursor -= size + 4;
      line = word;
    } else {
      line = next;
    }
  }
  if (line) {
    page.drawText(line, { x, y: cursor, size, font: typeFont, color });
    cursor -= size + 4;
  }
  return cursor;
}

const cover = pdf.addPage([612, 792]);
cover.drawText('PhotoAuthApp', { x: 56, y: 720, size: 28, font: fontBold, color: rgb(0.06, 0.3, 0.5) });
cover.drawText('Documento de entrega', { x: 56, y: 688, size: 16, font: fontBold, color: rgb(0.1, 0.14, 0.19) });
cover.drawText('Estudiante: Luis Carlos Contreras Aroche', { x: 56, y: 650, size: 12, font, color: rgb(0.1, 0.14, 0.19) });
cover.drawText('Aplicación móvil de autenticación y gestión de fotografías', { x: 56, y: 630, size: 12, font, color: rgb(0.1, 0.14, 0.19) });
cover.drawText('React Native + Expo + TypeScript + Supabase', { x: 56, y: 610, size: 12, font, color: rgb(0.1, 0.14, 0.19) });
cover.drawText('Repositorio de GitHub:', { x: 56, y: 570, size: 12, font: fontBold, color: rgb(0.1, 0.14, 0.19) });
addWrappedText(cover, repoUrl, 56, 548, 11, 500, font, rgb(0.06, 0.3, 0.5));

cover.drawText('Contenido', { x: 56, y: 500, size: 14, font: fontBold, color: rgb(0.1, 0.14, 0.19) });
const bullets = [
  '1. Inicio de sesión con correo y contraseña (Supabase Auth).',
  '2. Pantalla principal protegida por sesión válida, con cierre de sesión.',
  '3. Selección de fotografías desde la galería (Expo Image Picker).',
  '4. Captura con cámara, previa solicitud y verificación de permisos.',
];
let y = 475;
for (const item of bullets) {
  y = addWrappedText(cover, item, 56, y, 11, 500, font, rgb(0.2, 0.25, 0.3)) - 6;
}

for (const [file, caption] of images) {
  const page = pdf.addPage([612, 792]);
  page.drawText(caption, { x: 40, y: 750, size: 12, font: fontBold, color: rgb(0.06, 0.3, 0.5) });
  const bytes = await readFile(path.join(shots, file));
  const image = file.toLowerCase().endsWith('.png')
    ? await pdf.embedPng(bytes)
    : await pdf.embedJpg(bytes);
  const maxW = 532;
  const maxH = 680;
  const scale = Math.min(maxW / image.width, maxH / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  const x = (612 - w) / 2;
  page.drawImage(image, { x, y: 740 - h - 16, width: w, height: h });
}

const out = path.join(root, 'docs', 'Entrega-PhotoAuthApp-Luis-Carlos-Contreras-Aroche.pdf');
await writeFile(out, await pdf.save());
console.log(`PDF creado: ${out}`);
console.log(`Enlace usado: ${repoUrl}`);
