import { createCanvas, registerFont, loadImage } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Setup __dirname for ES Modules (since it doesn't exist by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async (userName, courseTitle, date) => {
  const width = 2000;
  const height = 1414; // A4 Aspect Ratio roughly
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 2. Draw Background (White)
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  
  // Optional: If you ever want to load an image, use path.join(__dirname, ...)
  // const template = await loadImage(path.join(__dirname, '../assets/certificate.png'));
  // ctx.drawImage(template, 0, 0, width, height);

  // 3. Draw Border
  ctx.strokeStyle = '#2563eb'; // Blue-600
  ctx.lineWidth = 20;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // 4. Header
  ctx.fillStyle = '#1e293b'; // Slate-800
  ctx.font = 'bold 80px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 300);

  // 5. "Presented to"
  ctx.font = '40px sans-serif';
  ctx.fillStyle = '#64748b'; // Slate-500
  ctx.fillText('This certificate is proudly presented to', width / 2, 450);

  // 6. User Name
  ctx.font = 'bold 120px sans-serif'; 
  ctx.fillStyle = '#000';
  ctx.fillText(userName, width / 2, 600);

  // 7. "For completing"
  ctx.font = '40px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('For successfully completing the course', width / 2, 750);

  // 8. Course Title
  ctx.font = 'bold 70px sans-serif';
  ctx.fillStyle = '#2563eb';
  ctx.fillText(courseTitle, width / 2, 900);

  // 9. Date
  ctx.font = '40px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Awarded on ${new Date(date).toLocaleDateString()}`, width / 2, 1100);

  return canvas.toDataURL('image/png');
};