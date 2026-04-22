/**
 * Gerador de sprites semi-realistas para o Farm Simulator.
 * Estilo: top-down detalhado com sombreamento, proporções realistas,
 * rodado duplo em máquinas pesadas, escala por potência.
 *
 * Uso: node generate-placeholders.js
 */
import { createCanvas, createImageData } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE = path.join(__dirname, 'game-frontend', 'assets');

// ============================================================
//  COLOR UTILS
// ============================================================
function hex2rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function darken(hex, amt) {
  let [r, g, b] = hex2rgb(hex);
  r = Math.max(0, Math.min(255, r - amt));
  g = Math.max(0, Math.min(255, g - amt));
  b = Math.max(0, Math.min(255, b - amt));
  return `rgb(${r},${g},${b})`;
}
function lighten(hex, amt) { return darken(hex, -amt); }

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRR(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color; rr(ctx, x, y, w, h, r); ctx.fill();
}
function strokeRR(ctx, x, y, w, h, r, color, lw) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; rr(ctx, x, y, w, h, r); ctx.stroke();
}

function addGloss(ctx, x, y, w, h, dir) {
  const grad = dir === 'h'
    ? ctx.createLinearGradient(x, y, x, y + h)
    : ctx.createLinearGradient(x, y, x + w, y);
  grad.addColorStop(0, 'rgba(255,255,255,0.18)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.04)');
  grad.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = grad;
  rr(ctx, x, y, w, h, 2); ctx.fill();
}

function drawCircle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

// ============================================================
//  WHEEL DRAWING (realistic rubber + hub)
// ============================================================
function drawWheel(ctx, x, y, w, h, isDual) {
  // Outer tire
  fillRR(ctx, x, y, w, h, 2, '#1a1a1a');
  // Tread pattern
  ctx.strokeStyle = 'rgba(60,60,60,0.6)';
  ctx.lineWidth = 0.5;
  const lines = Math.floor(h / 3);
  for (let i = 0; i < lines; i++) {
    const ly = y + 2 + i * (h - 4) / lines;
    ctx.beginPath(); ctx.moveTo(x + 1, ly); ctx.lineTo(x + w - 1, ly); ctx.stroke();
  }
  // Hub cap
  const hx = x + w / 2, hy = y + h / 2;
  drawCircle(ctx, hx, hy, Math.min(w, h) * 0.2, '#555');
  drawCircle(ctx, hx, hy, Math.min(w, h) * 0.1, '#888');

  if (isDual) {
    // Second tire offset
    fillRR(ctx, x - w - 1, y, w, h, 2, '#222');
    ctx.strokeStyle = 'rgba(60,60,60,0.5)';
    for (let i = 0; i < lines; i++) {
      const ly = y + 2 + i * (h - 4) / lines;
      ctx.beginPath(); ctx.moveTo(x - w, ly); ctx.lineTo(x - 1, ly); ctx.stroke();
    }
    drawCircle(ctx, x - w / 2 - 1, hy, Math.min(w, h) * 0.2, '#555');
  }
}

// ============================================================
//  TRACTOR (facing RIGHT, top-down)
// ============================================================
function drawTractor(ctx, W, H, cfg) {
  const cx = W / 2, cy = H / 2;
  const { color, accent, cabinColor, gears, label } = cfg;
  const is6g = gears === 6;

  // Dimensions scale with power
  const bw = W * (is6g ? 0.58 : 0.52);  // body width (left-right)
  const bh = H * (is6g ? 0.42 : 0.38);  // body height (top-bottom)
  const bx = cx - bw * 0.45;
  const by = cy - bh / 2;

  // Shadow
  fillRR(ctx, bx + 3, by + 3, bw, bh, 4, 'rgba(0,0,0,0.2)');

  // --- REAR WHEELS (left side = behind in top-down right-facing) ---
  const rwW = is6g ? 8 : 6;      // wheel width
  const rwH = is6g ? bh * 0.46 : bh * 0.42;  // wheel height
  const rwX = bx + bw * 0.15;
  drawWheel(ctx, rwX - rwW / 2, by - rwH - 2, rwW, rwH, is6g);  // top
  drawWheel(ctx, rwX - rwW / 2, by + bh + 2, rwW, rwH, false);   // bottom
  if (is6g) {
    drawWheel(ctx, rwX - rwW / 2, by + bh + 2, rwW, rwH, true);
  }

  // --- FRONT WHEELS (right side) ---
  const fwW = 5;
  const fwH = bh * 0.28;
  const fwX = bx + bw * 0.82;
  drawWheel(ctx, fwX - fwW / 2, by - fwH - 1, fwW, fwH, false);
  drawWheel(ctx, fwX - fwW / 2, by + bh + 1, fwW, fwH, false);

  // --- MAIN BODY ---
  fillRR(ctx, bx, by, bw, bh, 4, color);
  addGloss(ctx, bx, by, bw, bh, 'h');
  strokeRR(ctx, bx, by, bw, bh, 4, darken(color, 30), 1);

  // Hood (front half)
  const hoodX = bx + bw * 0.45;
  const hoodW = bw * 0.55;
  fillRR(ctx, hoodX, by + 2, hoodW - 2, bh - 4, 3, darken(color, 15));
  addGloss(ctx, hoodX, by + 2, hoodW - 2, bh - 4, 'h');

  // Hood vents
  ctx.strokeStyle = darken(color, 40);
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 4; i++) {
    const vx = hoodX + 6 + i * (hoodW - 14) / 3;
    ctx.beginPath();
    ctx.moveTo(vx, by + bh * 0.25);
    ctx.lineTo(vx, by + bh * 0.75);
    ctx.stroke();
  }

  // Brand accent stripe
  ctx.fillStyle = accent;
  if (is6g) {
    // Side stripes for premium
    ctx.fillRect(bx + 2, by + bh * 0.15, bw - 4, 2);
    ctx.fillRect(bx + 2, by + bh * 0.82, bw - 4, 2);
  } else {
    ctx.fillRect(hoodX + 2, cy - 1, hoodW - 6, 2);
  }

  // Grille (front tip)
  fillRR(ctx, bx + bw - 4, by + bh * 0.2, 4, bh * 0.6, 1, darken(color, 50));
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 3; i++) {
    const gy = by + bh * 0.28 + i * bh * 0.15;
    ctx.beginPath(); ctx.moveTo(bx + bw - 3, gy); ctx.lineTo(bx + bw, gy); ctx.stroke();
  }

  // --- CABIN ---
  const cabW = bw * 0.32;
  const cabH = bh * 0.72;
  const cabX = bx + 4;
  const cabY = cy - cabH / 2;
  fillRR(ctx, cabX, cabY, cabW, cabH, 3, cabinColor || darken(color, 10));
  // Glass
  fillRR(ctx, cabX + 2, cabY + 2, cabW - 4, cabH - 4, 2, 'rgba(100,185,255,0.45)');
  // Glass highlight
  const glassGrad = ctx.createLinearGradient(cabX + 2, cabY + 2, cabX + cabW - 2, cabY + 2);
  glassGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
  glassGrad.addColorStop(1, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = glassGrad;
  ctx.fillRect(cabX + 3, cabY + 3, cabW * 0.4, cabH - 6);

  // --- EXHAUST ---
  const exX = bx + bw * 0.6;
  const exY = by - 1;
  drawCircle(ctx, exX, exY, 3.5, '#aaa');
  drawCircle(ctx, exX, exY, 2, '#444');
  drawCircle(ctx, exX, exY, 1, '#222');

  // --- BEACON (giroflex) ---
  drawCircle(ctx, cabX + cabW / 2, cabY + 2, 2.5, '#f39c12');
  drawCircle(ctx, cabX + cabW / 2, cabY + 2, 1.2, '#fff3cd');

  // --- HEADLIGHTS ---
  drawCircle(ctx, bx + bw - 1, by + bh * 0.22, 2.5, '#fffde7');
  drawCircle(ctx, bx + bw - 1, by + bh * 0.78, 2.5, '#fffde7');
  drawCircle(ctx, bx + bw - 1, by + bh * 0.22, 1.2, '#fff');
  drawCircle(ctx, bx + bw - 1, by + bh * 0.78, 1.2, '#fff');

  // --- TAIL LIGHTS ---
  drawCircle(ctx, bx, by + bh * 0.25, 1.5, '#e74c3c');
  drawCircle(ctx, bx, by + bh * 0.75, 1.5, '#e74c3c');

  // --- HITCH (3-point) ---
  fillRR(ctx, bx - 5, cy - 3, 6, 6, 1, '#555');
  drawCircle(ctx, bx - 4, cy, 2, '#777');

  // Label
  if (label) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `bold ${is6g ? 7 : 6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy + 1);
  }
}

// ============================================================
//  HARVESTER (facing RIGHT, top-down)
// ============================================================
function drawHarvester(ctx, W, H, cfg) {
  const cx = W / 2, cy = H / 2;
  const { color, accent, tankColor, gears, label } = cfg;
  const is6g = gears === 6;

  const bw = W * 0.50;
  const bh = H * (is6g ? 0.44 : 0.40);
  const bx = cx - bw * 0.35;
  const by = cy - bh / 2;

  // Shadow
  fillRR(ctx, bx + 4, by + 4, bw + 14, bh + 4, 5, 'rgba(0,0,0,0.18)');

  // --- REAR WHEELS (big) ---
  const rwW = is6g ? 9 : 7;
  const rwH = bh * (is6g ? 0.52 : 0.45);
  const rwX = bx + bw * 0.22;
  drawWheel(ctx, rwX - rwW / 2, by - rwH - 3, rwW, rwH, is6g);
  drawWheel(ctx, rwX - rwW / 2, by + bh + 3, rwW, rwH, false);
  if (is6g) drawWheel(ctx, rwX - rwW / 2, by + bh + 3, rwW, rwH, true);

  // --- FRONT CASTERS ---
  const fwW = 4;
  const fwH = bh * 0.22;
  const fwX = bx + bw * 0.78;
  drawWheel(ctx, fwX, by - fwH, fwW, fwH, false);
  drawWheel(ctx, fwX, by + bh, fwW, fwH, false);

  // --- GRAIN TANK (main body) ---
  fillRR(ctx, bx, by, bw, bh, 5, color);
  addGloss(ctx, bx, by, bw, bh, 'h');
  strokeRR(ctx, bx, by, bw, bh, 5, darken(color, 25), 1);

  // Tank top detail
  const tkColor = tankColor || lighten(color, 20);
  fillRR(ctx, bx + bw * 0.28, by + 3, bw * 0.44, bh - 6, 3, tkColor);
  strokeRR(ctx, bx + bw * 0.28, by + 3, bw * 0.44, bh - 6, 3, darken(tkColor, 15), 0.5);
  // Tank lid line
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.moveTo(bx + bw * 0.5, by + 4); ctx.lineTo(bx + bw * 0.5, by + bh - 4); ctx.stroke();

  // --- CABIN ---
  const cabW = bw * 0.26;
  const cabH = bh * 0.72;
  const cabX = bx + 3;
  const cabY = cy - cabH / 2;
  fillRR(ctx, cabX, cabY, cabW, cabH, 3, darken(color, 10));
  fillRR(ctx, cabX + 2, cabY + 2, cabW - 4, cabH - 4, 2, 'rgba(100,185,255,0.5)');
  // Glass highlight
  const glg = ctx.createLinearGradient(cabX, cabY, cabX + cabW, cabY);
  glg.addColorStop(0, 'rgba(255,255,255,0.22)');
  glg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glg;
  ctx.fillRect(cabX + 3, cabY + 3, cabW * 0.4, cabH - 6);

  // --- HEADER / CUTTER BAR ---
  const hdrW = 10;
  const hdrH = H * 0.72;
  const hdrX = bx + bw + 4;
  const hdrY = cy - hdrH / 2;
  fillRR(ctx, hdrX, hdrY, hdrW, hdrH, 2, darken(color, 30));
  strokeRR(ctx, hdrX, hdrY, hdrW, hdrH, 2, darken(color, 45), 0.5);
  // Reel bars
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  const barCount = Math.floor(hdrH / 7);
  for (let i = 0; i < barCount; i++) {
    const barY = hdrY + 3 + i * (hdrH - 6) / (barCount - 1);
    ctx.beginPath(); ctx.moveTo(hdrX + 1, barY); ctx.lineTo(hdrX + hdrW - 1, barY); ctx.stroke();
  }

  // --- AUGER ---
  const augStartX = bx + bw * 0.4;
  const augStartY = by + bh + 2;
  const augEndX = bx + 6;
  const augEndY = by + bh + 10;
  ctx.strokeStyle = darken(color, 10);
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(augStartX, augStartY); ctx.lineTo(augEndX, augEndY); ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(augStartX, augStartY); ctx.lineTo(augEndX, augEndY); ctx.stroke();

  // --- EXHAUST ---
  drawCircle(ctx, bx + bw * 0.65, by - 2, 3, '#aaa');
  drawCircle(ctx, bx + bw * 0.65, by - 2, 1.5, '#333');

  // --- BEACONS ---
  drawCircle(ctx, cabX + cabW / 2, cabY + 2, 2.5, '#f39c12');
  drawCircle(ctx, cabX + cabW / 2, cabY + 2, 1, '#fff3cd');

  // --- LIGHTS ---
  drawCircle(ctx, hdrX + hdrW, hdrY + 4, 2, '#fffde7');
  drawCircle(ctx, hdrX + hdrW, hdrY + hdrH - 4, 2, '#fffde7');

  // Accent stripe
  ctx.fillStyle = accent;
  ctx.fillRect(bx + 2, by + bh * 0.12, bw - 4, 2);

  if (label) {
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = `bold ${is6g ? 7 : 6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(label, cx - 2, cy + 2);
  }
}

// ============================================================
//  TRUCK (facing RIGHT, top-down)
// ============================================================
function drawTruck(ctx, W, H, cfg) {
  const cx = W / 2, cy = H / 2;
  const { cabColor, cargoColor, glassColor, accent, gears, label } = cfg;
  const is6g = gears === 6;

  const totalW = W * 0.88;
  const cabW = totalW * 0.30;
  const cgW = totalW * 0.65;
  const gap = totalW * 0.05;
  const bodyH = H * (is6g ? 0.55 : 0.50);

  const cgX = cx - totalW / 2;
  const cgY = cy - bodyH / 2;
  const cabX = cgX + cgW + gap;
  const cabY = cy - bodyH * 0.45;
  const cabH = bodyH * 0.9;

  // Shadow
  fillRR(ctx, cgX + 3, cgY + 3, totalW, bodyH, 4, 'rgba(0,0,0,0.18)');

  // --- REAR DUAL AXLE WHEELS ---
  const rwW = 6;
  const rwH = bodyH * 0.32;
  const rw1X = cgX + cgW * 0.55;
  const rw2X = cgX + cgW * 0.72;
  drawWheel(ctx, rw1X, cgY - rwH - 2, rwW, rwH, is6g);
  drawWheel(ctx, rw1X, cgY + bodyH + 2, rwW, rwH, false);
  if (is6g) drawWheel(ctx, rw1X, cgY + bodyH + 2, rwW, rwH, true);
  drawWheel(ctx, rw2X, cgY - rwH - 2, rwW, rwH, false);
  drawWheel(ctx, rw2X, cgY + bodyH + 2, rwW, rwH, false);

  // --- FRONT WHEELS ---
  const fwX = cabX + cabW * 0.5;
  drawWheel(ctx, fwX, cabY - rwH * 0.7 - 1, 5, rwH * 0.7, false);
  drawWheel(ctx, fwX, cabY + cabH + 1, 5, rwH * 0.7, false);

  // --- CARGO BED ---
  fillRR(ctx, cgX, cgY, cgW, bodyH, 3, cargoColor);
  addGloss(ctx, cgX, cgY, cgW, bodyH, 'h');
  strokeRR(ctx, cgX, cgY, cgW, bodyH, 3, darken(cargoColor, 25), 1);
  // Cargo rails
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.6;
  const railSpace = Math.round(cgW / 5);
  for (let i = railSpace; i < cgW; i += railSpace) {
    ctx.beginPath(); ctx.moveTo(cgX + i, cgY + 2); ctx.lineTo(cgX + i, cgY + bodyH - 2); ctx.stroke();
  }

  // --- CAB ---
  fillRR(ctx, cabX, cabY, cabW, cabH, 3, cabColor);
  addGloss(ctx, cabX, cabY, cabW, cabH, 'h');
  strokeRR(ctx, cabX, cabY, cabW, cabH, 3, darken(cabColor, 30), 1);

  // Windshield
  fillRR(ctx, cabX + 3, cabY + 3, cabW - 6, cabH - 6, 2, glassColor);
  fillRR(ctx, cabX + 4, cabY + 4, cabW * 0.45, cabH - 8, 1, 'rgba(100,185,255,0.35)');

  // Front grille
  ctx.fillStyle = accent;
  fillRR(ctx, cabX + cabW - 3, cabY + cabH * 0.18, 3, cabH * 0.64, 1, accent);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 4; i++) {
    const gy = cabY + cabH * 0.22 + i * cabH * 0.15;
    ctx.beginPath(); ctx.moveTo(cabX + cabW - 2, gy); ctx.lineTo(cabX + cabW, gy); ctx.stroke();
  }

  // --- EXHAUST (vertical pipe behind cab) ---
  drawCircle(ctx, cabX - 2, cabY - 1, 3, '#bbb');
  drawCircle(ctx, cabX - 2, cabY - 1, 1.5, '#333');

  // --- BEACONS ---
  drawCircle(ctx, cabX + cabW * 0.3, cabY + 2, 1.8, '#f39c12');
  drawCircle(ctx, cabX + cabW * 0.7, cabY + 2, 1.8, '#f39c12');

  // --- HEADLIGHTS ---
  drawCircle(ctx, cabX + cabW, cabY + cabH * 0.2, 2.5, '#fffde7');
  drawCircle(ctx, cabX + cabW, cabY + cabH * 0.8, 2.5, '#fffde7');
  drawCircle(ctx, cabX + cabW, cabY + cabH * 0.2, 1, '#fff');
  drawCircle(ctx, cabX + cabW, cabY + cabH * 0.8, 1, '#fff');

  // --- TAIL LIGHTS ---
  drawCircle(ctx, cgX, cgY + bodyH * 0.2, 2, '#e74c3c');
  drawCircle(ctx, cgX, cgY + bodyH * 0.8, 2, '#e74c3c');

  if (label) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy + 2);
  }
}

// ============================================================
//  IMPLEMENT (facing RIGHT, top-down)
// ============================================================
function drawImplement(ctx, W, H, cfg) {
  const cx = W / 2, cy = H / 2;
  const { color, metalColor, discColor, count, type } = cfg;

  // Hitch arm
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(2, cy); ctx.lineTo(W * 0.18, cy); ctx.stroke();
  drawCircle(ctx, 3, cy, 3, '#666');
  drawCircle(ctx, 3, cy, 1.5, '#999');

  // Frame
  const fW = W * 0.7;
  const fH = H * 0.75;
  const fX = W * 0.22;
  const fY = cy - fH / 2;
  fillRR(ctx, fX, fY, fW, fH, 3, color);
  addGloss(ctx, fX, fY, fW, fH, 'v');
  strokeRR(ctx, fX, fY, fW, fH, 3, darken(color, 25), 0.8);

  // Components (discs/tines)
  const spacing = fH / (count + 1);
  for (let i = 0; i < count; i++) {
    const compY = fY + spacing * (i + 1);
    const compW = fW * 0.7;
    const compH = spacing * 0.5;
    const compX = fX + (fW - compW) / 2;

    if (type === 'seeder') {
      // Seeder tubes
      fillRR(ctx, compX, compY - compH / 2, compW, compH, 1, discColor);
      ctx.strokeStyle = metalColor;
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(compX + compW, compY); ctx.lineTo(fX + fW + 3, compY); ctx.stroke();
      drawCircle(ctx, fX + fW + 4, compY, 1.5, discColor);
    } else {
      // Discs/tines
      fillRR(ctx, compX, compY - compH / 2, compW, compH, 2, discColor);
      strokeRR(ctx, compX, compY - compH / 2, compW, compH, 2, darken(discColor, 20), 0.4);
      // Shaft
      ctx.strokeStyle = metalColor;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(compX + compW, compY); ctx.lineTo(fX + fW + 2, compY); ctx.stroke();
    }
  }

  // Transport wheels
  const wW = 5;
  const wH = Math.min(fH * 0.18, 8);
  drawWheel(ctx, fX + fW / 2 - wW / 2, fY - wH - 1, wW, wH, false);
  drawWheel(ctx, fX + fW / 2 - wW / 2, fY + fH + 1, wW, wH, false);
}

// ============================================================
//  TERRAIN TILES
// ============================================================
function drawGrass(ctx, w, h) {
  ctx.fillStyle = '#3a8c3f';
  ctx.fillRect(0, 0, w, h);
  // Variation patches
  const colors = ['#2d7a32', '#45994a', '#3a8c3f', '#4fa854'];
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    const rx = Math.random() * w, ry = Math.random() * h;
    ctx.fillRect(rx, ry, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  // Grass blades
  ctx.strokeStyle = 'rgba(50,130,50,0.3)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 8; i++) {
    const gx = Math.random() * w, gy = Math.random() * h;
    ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + 1, gy - 3); ctx.stroke();
  }
}

function drawDirt(ctx, w, h) {
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(0, 0, w, h);
  const colors = ['#7a5c10', '#9c7820', '#6d4e0e'];
  for (let i = 0; i < 25; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}

function drawRoad(ctx, w, h) {
  ctx.fillStyle = '#444';
  ctx.fillRect(0, 0, w, h);
  // Asphalt grain
  ctx.fillStyle = 'rgba(100,100,100,0.15)';
  for (let i = 0; i < 15; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
  // Center line dashes
  ctx.setLineDash([4, 5]);
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
  ctx.setLineDash([]);
  // Edge lines
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(1, 0); ctx.lineTo(1, h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w - 1, 0); ctx.lineTo(w - 1, h); ctx.stroke();
}

// ============================================================
//  BUILDINGS
// ============================================================
function drawBuilding(ctx, w, h, cfg) {
  const { baseColor, roofColor, emoji } = cfg;
  // Roof shadow
  fillRR(ctx, 3, 3, w - 6, h - 6, 5, 'rgba(0,0,0,0.15)');
  // Walls
  fillRR(ctx, 4, 4, w - 8, h - 8, 5, baseColor);
  addGloss(ctx, 4, 4, w - 8, h - 8, 'v');
  strokeRR(ctx, 4, 4, w - 8, h - 8, 5, darken(baseColor, 30), 1);
  // Roof edge
  fillRR(ctx, 6, 6, w - 12, 5, 2, roofColor);
  fillRR(ctx, 6, h - 11, w - 12, 5, 2, roofColor);
  // Door
  fillRR(ctx, w / 2 - 4, h - 16, 8, 10, 1, darken(baseColor, 50));
  // Windows
  fillRR(ctx, w * 0.2, h * 0.35, 6, 5, 1, 'rgba(100,185,255,0.5)');
  fillRR(ctx, w * 0.65, h * 0.35, 6, 5, 1, 'rgba(100,185,255,0.5)');
  // Emoji
  if (emoji) {
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, w / 2, h / 2 + 5);
  }
}

// ============================================================
//  NATURE & PLAYER & CROPS
// ============================================================
function drawTree(ctx, w, h) {
  // Trunk
  fillRR(ctx, w / 2 - 2, h * 0.52, 4, h * 0.38, 1, '#6b4226');
  fillRR(ctx, w / 2 - 1, h * 0.54, 2, h * 0.34, 1, '#7d4f2e');
  // Foliage layers
  drawCircle(ctx, w / 2, h * 0.40, w * 0.38, '#1e7a2e');
  drawCircle(ctx, w / 2 - 3, h * 0.33, w * 0.25, '#2d9a3a');
  drawCircle(ctx, w / 2 + 2, h * 0.38, w * 0.22, '#259431');
  // Highlight
  drawCircle(ctx, w / 2 - 2, h * 0.30, w * 0.12, 'rgba(100,220,100,0.3)');
}

function drawLake(ctx, w, h) {
  // Water body
  ctx.fillStyle = '#1a6fa0';
  ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.44, h * 0.40, 0, 0, Math.PI * 2); ctx.fill();
  // Depth
  ctx.fillStyle = '#155d8a';
  ctx.beginPath(); ctx.ellipse(w / 2 + 2, h / 2 + 2, w * 0.30, h * 0.25, 0, 0, Math.PI * 2); ctx.fill();
  // Reflections
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.ellipse(w * 0.38, h * 0.38, w * 0.12, h * 0.06, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.ellipse(w * 0.55, h * 0.45, w * 0.08, h * 0.04, 0.2, 0, Math.PI * 2); ctx.fill();
  // Shore
  ctx.strokeStyle = 'rgba(60,140,80,0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.46, h * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
}

function drawPlayer(ctx, w, h) {
  // Head
  drawCircle(ctx, w / 2, h * 0.28, 5.5, '#e8b88a');
  drawCircle(ctx, w / 2, h * 0.24, 5.5, '#8B4513'); // hat/hair
  drawCircle(ctx, w / 2, h * 0.30, 4.5, '#e8b88a');
  // Body (overalls)
  fillRR(ctx, w / 2 - 5, h * 0.40, 10, 11, 2, '#2563a8');
  // Belt
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(w / 2 - 5, h * 0.52, 10, 2);
  // Legs
  fillRR(ctx, w / 2 - 4, h * 0.60, 3, 8, 1, '#1e4d78');
  fillRR(ctx, w / 2 + 1, h * 0.60, 3, 8, 1, '#1e4d78');
  // Boots
  fillRR(ctx, w / 2 - 5, h * 0.80, 4, 4, 1, '#3b2f2f');
  fillRR(ctx, w / 2 + 1, h * 0.80, 4, 4, 1, '#3b2f2f');
}

function drawCrop(ctx, w, h, stage) {
  // Soil
  ctx.fillStyle = '#6d4c2e';
  ctx.fillRect(0, h * 0.72, w, h * 0.28);
  ctx.fillStyle = '#5a3e24';
  ctx.fillRect(0, h * 0.72, w, 2);

  const stemColor = stage === 1 ? '#4caf50' : stage === 2 ? '#2e7d32' : '#8bc34a';
  const tipColor = stage === 3 ? '#f0b810' : stemColor;

  for (let i = 0; i < (stage === 1 ? 2 : 3); i++) {
    const sx = 6 + i * 10;
    const stemH = stage === 1 ? 8 : stage === 2 ? 14 : 18;
    const baseY = h * 0.72;

    // Stem
    ctx.fillStyle = stemColor;
    ctx.fillRect(sx, baseY - stemH, 2, stemH);

    // Leaves
    if (stage >= 2) {
      ctx.fillStyle = stemColor;
      ctx.fillRect(sx - 3, baseY - stemH + 4, 3, 1.5);
      ctx.fillRect(sx + 2, baseY - stemH + 7, 3, 1.5);
      if (stage === 3) {
        ctx.fillRect(sx - 4, baseY - stemH + 10, 4, 1.5);
      }
    }
    // Grain head
    if (stage === 3) {
      drawCircle(ctx, sx + 1, baseY - stemH - 2, 3.5, tipColor);
      drawCircle(ctx, sx + 1, baseY - stemH - 2, 2, '#d4a017');
    }
  }
}

// ============================================================
//  SPRITE MANIFEST
// ============================================================
const VEHICLES = {
  tractor_mf275:     { w: 56, h: 48, gears: 4, color: '#b5291c', accent: '#ddd', cabinColor: '#8a1f15', label: 'MF' },
  tractor_valtra:    { w: 60, h: 50, gears: 4, color: '#1e3a5f', accent: '#4a9fd4', cabinColor: '#152d4a', label: 'Valtra' },
  tractor_nh:        { w: 72, h: 56, gears: 6, color: '#1565a3', accent: '#f1c40f', cabinColor: '#0e5088', label: 'NH' },
  tractor_jd:        { w: 76, h: 58, gears: 6, color: '#2e7d32', accent: '#f1c40f', cabinColor: '#1b5e20', label: 'JD' },
  tractor_case:      { w: 80, h: 60, gears: 6, color: '#c62828', accent: '#222', cabinColor: '#8e1c1c', label: 'Case' },
};
const HARVESTERS = {
  harvester_mf5650:  { w: 72, h: 64, gears: 4, color: '#b5291c', accent: '#ccc', tankColor: '#962015', label: 'MF' },
  harvester_nh:      { w: 88, h: 72, gears: 6, color: '#1565a3', accent: '#f1c40f', tankColor: '#0e5088', label: 'NH' },
  harvester_jd:      { w: 96, h: 80, gears: 6, color: '#2e7d32', accent: '#f1c40f', tankColor: '#1b5e20', label: 'JD' },
};
const TRUCKS_CFG = {
  truck_vw:          { w: 80, h: 50, gears: 4, cabColor: '#ddd', cargoColor: '#7f8c8d', glassColor: '#4a90b8', accent: '#aaa', label: 'VW' },
  truck_mb:          { w: 88, h: 52, gears: 6, cabColor: '#1e5fa8', cargoColor: '#95a5a6', glassColor: '#5dade2', accent: '#2c3e50', label: 'MB' },
  truck_scania:      { w: 96, h: 56, gears: 6, cabColor: '#d35400', cargoColor: '#2c3e50', glassColor: '#e67e22', accent: '#111', label: 'Scania' },
};
const IMPLEMENTS_CFG = {
  plow_small:    { w: 44, h: 36, count: 2, color: '#8e2418', metalColor: '#aaa', discColor: '#888', type: 'plow' },
  plow_medium:   { w: 52, h: 40, count: 3, color: '#8e2418', metalColor: '#aaa', discColor: '#888', type: 'plow' },
  plow_large:    { w: 64, h: 50, count: 5, color: '#8e2418', metalColor: '#bbb', discColor: '#999', type: 'plow' },
  harrow_small:  { w: 44, h: 36, count: 4, color: '#333', metalColor: '#777', discColor: '#aaa', type: 'harrow' },
  harrow_medium: { w: 52, h: 40, count: 6, color: '#333', metalColor: '#777', discColor: '#aaa', type: 'harrow' },
  harrow_large:  { w: 64, h: 50, count: 8, color: '#333', metalColor: '#888', discColor: '#bbb', type: 'harrow' },
  seeder_small:  { w: 44, h: 36, count: 2, color: '#1b5e20', metalColor: '#aaa', discColor: '#66bb6a', type: 'seeder' },
  seeder_medium: { w: 52, h: 40, count: 3, color: '#1b5e20', metalColor: '#aaa', discColor: '#66bb6a', type: 'seeder' },
  seeder_large:  { w: 64, h: 50, count: 4, color: '#1b5e20', metalColor: '#bbb', discColor: '#81c784', type: 'seeder' },
};

// ============================================================
//  GENERATE ALL
// ============================================================
function generateAndSave(relPath, w, h, drawFn) {
  const outPath = path.join(BASE, relPath + '.png');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  drawFn(ctx, w, h);
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`✅ ${relPath}.png (${w}×${h})`);
}

let total = 0;

// Vehicles
for (const [id, cfg] of Object.entries(VEHICLES)) {
  generateAndSave('vehicles/' + id, cfg.w, cfg.h, (ctx, w, h) => drawTractor(ctx, w, h, cfg));
  total++;
}
for (const [id, cfg] of Object.entries(HARVESTERS)) {
  generateAndSave('vehicles/' + id, cfg.w, cfg.h, (ctx, w, h) => drawHarvester(ctx, w, h, cfg));
  total++;
}
for (const [id, cfg] of Object.entries(TRUCKS_CFG)) {
  generateAndSave('vehicles/' + id, cfg.w, cfg.h, (ctx, w, h) => drawTruck(ctx, w, h, cfg));
  total++;
}

// Implements
for (const [id, cfg] of Object.entries(IMPLEMENTS_CFG)) {
  generateAndSave('implements/' + id, cfg.w, cfg.h, (ctx, w, h) => drawImplement(ctx, w, h, cfg));
  total++;
}

// Terrain
generateAndSave('terrain/grass', 32, 32, drawGrass); total++;
generateAndSave('terrain/dirt', 32, 32, drawDirt); total++;
generateAndSave('terrain/road', 32, 32, drawRoad); total++;
generateAndSave('terrain/tree', 32, 32, drawTree); total++;
generateAndSave('terrain/lake', 48, 48, drawLake); total++;
generateAndSave('terrain/crop_1', 32, 32, (c, w, h) => drawCrop(c, w, h, 1)); total++;
generateAndSave('terrain/crop_2', 32, 32, (c, w, h) => drawCrop(c, w, h, 2)); total++;
generateAndSave('terrain/crop_3', 32, 32, (c, w, h) => drawCrop(c, w, h, 3)); total++;

// Buildings
const buildings = [
  ['buildings/house', 64, 64, { baseColor: '#c0694e', roofColor: '#8b3a2a', emoji: '🏠' }],
  ['buildings/silo', 64, 64, { baseColor: '#78909c', roofColor: '#546e7a', emoji: '🏗️' }],
  ['buildings/shop', 64, 64, { baseColor: '#d4a029', roofColor: '#b8860b', emoji: '🏪' }],
  ['buildings/gas_station', 64, 64, { baseColor: '#b53a2a', roofColor: '#8b2a1a', emoji: '⛽' }],
  ['buildings/sell', 64, 64, { baseColor: '#34495e', roofColor: '#2c3e50', emoji: '💰' }],
];
buildings.forEach(([p, w, h, cfg]) => {
  generateAndSave(p, w, h, (ctx, W, H) => drawBuilding(ctx, W, H, cfg));
  total++;
});

// Player
const playerDirs = ['player_down', 'player_up', 'player_side'];
playerDirs.forEach(d => {
  generateAndSave('ui/' + d, 32, 32, drawPlayer);
  total++;
});

console.log(`\n🎉 ${total} sprites semi-realistas gerados em ${BASE}`);
