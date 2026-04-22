// ============================================================
//  SPRITE FACTORY — Semi-realistic Top-Down Sprites
//  Generated via Canvas2D · Zero external assets
// ============================================================
(function () {
'use strict';

// === VEHICLE DEFINITIONS ===
const TRACTORS = {
    tractor_mf275: {
        brandId: 'mf', canvas: 52,
        bodyW: 0.36, bodyL: 0.56, rwW: 0.11, rwL: 0.24, fwW: 0.07, fwL: 0.14,
        body: '#e74c3c', hood: '#c0392b', cabin: '#922b21', accent: '#ecf0f1', dualRear: false,
    },
    tractor_valtra: {
        brandId: 'vt', canvas: 56,
        bodyW: 0.37, bodyL: 0.56, rwW: 0.11, rwL: 0.25, fwW: 0.07, fwL: 0.14,
        body: '#8e44ad', hood: '#732d91', cabin: '#4a235a', accent: '#ecf0f1', dualRear: false,
    },
    tractor_nh: {
        brandId: 'nh', canvas: 62,
        bodyW: 0.37, bodyL: 0.57, rwW: 0.11, rwL: 0.25, fwW: 0.07, fwL: 0.15,
        body: '#2980b9', hood: '#2471a3', cabin: '#154360', accent: '#f1c40f', dualRear: false,
    },
    tractor_jd: {
        brandId: 'jd', canvas: 68,
        bodyW: 0.38, bodyL: 0.57, rwW: 0.12, rwL: 0.26, fwW: 0.08, fwL: 0.15,
        body: '#27ae60', hood: '#1e8449', cabin: '#145a32', accent: '#f1c40f', dualRear: false,
    },
    tractor_case: {
        brandId: 'case', canvas: 76,
        bodyW: 0.38, bodyL: 0.58, rwW: 0.10, rwL: 0.26, fwW: 0.08, fwL: 0.15,
        body: '#a93226', hood: '#7b241c', cabin: '#17202a', accent: '#111111', dualRear: true,
    },
};

const HARVESTERS = {
    harvester_mf5650: {
        brandId: 'mf', canvas: 76,
        bodyW: 0.40, bodyL: 0.50, headerW: 0.72, headerH: 0.09, rwW: 0.10, rwL: 0.22, fwW: 0.06, fwL: 0.10,
        body: '#e74c3c', cabin: '#922b21', header: '#c0392b', accent: '#ecf0f1', tank: '#c0392b',
    },
    harvester_nh: {
        brandId: 'nh', canvas: 84,
        bodyW: 0.40, bodyL: 0.50, headerW: 0.78, headerH: 0.10, rwW: 0.10, rwL: 0.23, fwW: 0.06, fwL: 0.10,
        body: '#2980b9', cabin: '#154360', header: '#2471a3', accent: '#f1c40f', tank: '#1f618d',
    },
    harvester_jd: {
        brandId: 'jd', canvas: 96,
        bodyW: 0.42, bodyL: 0.50, headerW: 0.80, headerH: 0.10, rwW: 0.10, rwL: 0.24, fwW: 0.06, fwL: 0.10,
        body: '#27ae60', cabin: '#145a32', header: '#1e8449', accent: '#f1c40f', tank: '#196f3d',
    },
};

const TRUCKS = {
    truck_vw: {
        brandId: 'vw', canvas: 64,
        cabW: 0.34, cabL: 0.24, cargoW: 0.36, cargoL: 0.46, wheelW: 0.08, wheelL: 0.14,
        cab: '#ecf0f1', cargo: '#7f8c8d', glass: '#3498db', accent: '#7f8c8d',
    },
    truck_mb: {
        brandId: 'mb', canvas: 70,
        cabW: 0.34, cabL: 0.24, cargoW: 0.37, cargoL: 0.48, wheelW: 0.08, wheelL: 0.14,
        cab: '#2980b9', cargo: '#95a5a6', glass: '#5dade2', accent: '#34495e',
    },
    truck_scania: {
        brandId: 'scania', canvas: 78,
        cabW: 0.36, cabL: 0.26, cargoW: 0.38, cargoL: 0.48, wheelW: 0.09, wheelL: 0.15,
        cab: '#e67e22', cargo: '#34495e', glass: '#f39c12', accent: '#111111',
    },
};

const IMPLS = {
    plow_small:    { type: 'plow',   canvas: 40, count: 2, w: 0.50, l: 0.55, frame: '#c0392b', metal: '#bdc3c7', disc: '#7f8c8d' },
    plow_medium:   { type: 'plow',   canvas: 48, count: 3, w: 0.55, l: 0.55, frame: '#c0392b', metal: '#bdc3c7', disc: '#7f8c8d' },
    plow_large:    { type: 'plow',   canvas: 56, count: 5, w: 0.60, l: 0.55, frame: '#c0392b', metal: '#bdc3c7', disc: '#7f8c8d' },
    harrow_small:  { type: 'harrow', canvas: 40, count: 4, w: 0.55, l: 0.50, frame: '#2c3e50', metal: '#7f8c8d', disc: '#bdc3c7' },
    harrow_medium: { type: 'harrow', canvas: 48, count: 6, w: 0.60, l: 0.50, frame: '#2c3e50', metal: '#7f8c8d', disc: '#bdc3c7' },
    harrow_large:  { type: 'harrow', canvas: 56, count: 8, w: 0.65, l: 0.50, frame: '#2c3e50', metal: '#7f8c8d', disc: '#bdc3c7' },
    seeder_small:  { type: 'seeder', canvas: 40, count: 2, w: 0.50, l: 0.55, frame: '#27ae60', metal: '#95a5a6', disc: '#f1c40f' },
    seeder_medium: { type: 'seeder', canvas: 48, count: 3, w: 0.55, l: 0.55, frame: '#27ae60', metal: '#95a5a6', disc: '#f1c40f' },
    seeder_large:  { type: 'seeder', canvas: 56, count: 4, w: 0.60, l: 0.55, frame: '#27ae60', metal: '#95a5a6', disc: '#f1c40f' },
};

// ============================================================
//  DRAWING UTILITIES
// ============================================================
function fillRR(ctx, x, y, w, h, r, color) {
    if (w <= 0 || h <= 0) return;
    r = Math.min(r, w / 2, h / 2);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
}

function strokeRR(ctx, x, y, w, h, r, color, lw) {
    if (w <= 0 || h <= 0) return;
    r = Math.min(r, w / 2, h / 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw || 1;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.stroke();
}

function drawWheel(ctx, x, y, w, h, treadDir) {
    const g = ctx.createLinearGradient(x, y, treadDir === 'v' ? x + w : x, treadDir === 'v' ? y : y + h);
    g.addColorStop(0, '#0a0a0a');
    g.addColorStop(0.4, '#2a2a2a');
    g.addColorStop(1, '#050505');
    fillRR(ctx, x, y, w, h, 2, g);

    // Tread pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 0.8;
    if (treadDir === 'v') {
        for (let i = 2; i < h - 1; i += 3) {
            ctx.beginPath(); ctx.moveTo(x, y + i); ctx.lineTo(x + w, y + i); ctx.stroke();
        }
    } else {
        for (let i = 2; i < w - 1; i += 3) {
            ctx.beginPath(); ctx.moveTo(x + i, y); ctx.lineTo(x + i, y + h); ctx.stroke();
        }
    }
    // Rim/hub
    ctx.fillStyle = 'rgba(150,150,160,0.6)';
    const rx = x + w * 0.25, ry = y + h * 0.25;
    fillRR(ctx, rx, ry, w * 0.5, h * 0.5, 2, 'rgba(120,120,120,0.8)');
}

function drawShadow(ctx, x, y, w, h, r) {
    ctx.fillStyle = 'rgba(0,0,0,0.17)';
    fillRR(ctx, x, y, w, h, r || 4, 'rgba(0,0,0,0.17)');
}

function drawCircle(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function drawGlassHighlight(ctx, x, y, w, h) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, 'rgba(255,255,255,0.7)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.1)');
    g.addColorStop(1, 'rgba(255,255,255,0.3)');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
    ctx.fillRect(x, y, w, h);
}

function drawGloss(ctx, x, y, w, h, dir, r=3) {
    const g = ctx.createLinearGradient(x, y, dir === 'v' ? x + w : x, dir === 'v' ? y : y + h);
    g.addColorStop(0, 'rgba(0,0,0,0.6)');
    g.addColorStop(0.15, 'rgba(255,255,255,0.3)');
    g.addColorStop(0.5, 'rgba(0,0,0,0)');
    g.addColorStop(0.85, 'rgba(255,255,255,0.15)');
    g.addColorStop(1, 'rgba(0,0,0,0.7)');
    fillRR(ctx, x, y, w, h, r, g);
}

// ============================================================
//  TRACTOR DRAWING
// ============================================================
function drawTractor(ctx, raw, dir, cw, ch) {
    const s = raw.canvas;
    const cx = cw / 2, cy = ch / 2;
    const p = {
        bw: Math.round(s * raw.bodyW), bl: Math.round(s * raw.bodyL),
        rwW: Math.round(s * raw.rwW), rwL: Math.round(s * raw.rwL),
        fwW: Math.round(s * raw.fwW), fwL: Math.round(s * raw.fwL),
    };
    const isV = dir === 'down' || dir === 'up';

    // Shadow
    const so = { down: [2, 3], up: [-2, -3], left: [-3, 2], right: [3, 2] }[dir];
    const sw = isV ? p.bw + 8 : p.bl + 8;
    const sh = isV ? p.bl + 8 : p.bw + 8;
    drawShadow(ctx, cx - sw / 2 + so[0], cy - sh / 2 + so[1], sw, sh, 5);

    if (isV) {
        drawTractorV(ctx, p, raw, dir === 'up', cx, cy);
    } else {
        drawTractorH(ctx, p, raw, dir === 'left', cx, cy);
    }
}

function drawTractorV(ctx, p, c, flip, cx, cy) {
    const d = flip ? -1 : 1;

    // Rear wheels (big, at the back)
    const rY = cy - d * p.bl * 0.15;
    drawWheel(ctx, cx - p.bw / 2 - p.rwW - 1, rY - p.rwL / 2, p.rwW, p.rwL, 'v');
    drawWheel(ctx, cx + p.bw / 2 + 1, rY - p.rwL / 2, p.rwW, p.rwL, 'v');
    if (c.dualRear) {
        drawWheel(ctx, cx - p.bw / 2 - p.rwW * 2 - 3, rY - p.rwL / 2, p.rwW, p.rwL, 'v');
        drawWheel(ctx, cx + p.bw / 2 + p.rwW + 3, rY - p.rwL / 2, p.rwW, p.rwL, 'v');
    }

    // Front wheels (small)
    const fY = cy + d * p.bl * 0.3;
    drawWheel(ctx, cx - p.bw / 2 + 1, fY - p.fwL / 2, p.fwW, p.fwL, 'v');
    drawWheel(ctx, cx + p.bw / 2 - p.fwW - 1, fY - p.fwL / 2, p.fwW, p.fwL, 'v');

    // Fenders over rear wheels
    const fenderY = rY - p.rwL / 2;
    fillRR(ctx, cx - p.bw / 2 - p.rwW + 1, fenderY, p.rwW + 2, 3, 1, c.accent);
    fillRR(ctx, cx + p.bw / 2 - 2, fenderY, p.rwW + 2, 3, 1, c.accent);

    // Main body
    fillRR(ctx, cx - p.bw / 2, cy - p.bl / 2, p.bw, p.bl, 4, c.body);
    drawGloss(ctx, cx - p.bw / 2, cy - p.bl / 2, p.bw, p.bl, 'v', 4);
    strokeRR(ctx, cx - p.bw / 2, cy - p.bl / 2, p.bw, p.bl, 4, 'rgba(255,255,255,0.1)', 1);

    // Hood (front section ~40%)
    const hTop = flip ? (cy - p.bl / 2) : (cy + p.bl * 0.08);
    const hH = p.bl * 0.40;
    fillRR(ctx, cx - p.bw / 2 + 2, hTop, p.bw - 4, hH, 2, c.hood);
    drawGloss(ctx, cx - p.bw / 2 + 2, hTop, p.bw - 4, hH, 'v', 2);

    // Hood vents
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.7;
    const ventStep = Math.max(3, Math.round(hH / 7));
    for (let i = 3; i < hH - 2; i += ventStep) {
        ctx.beginPath();
        ctx.moveTo(cx - p.bw / 2 + 5, hTop + i);
        ctx.lineTo(cx + p.bw / 2 - 5, hTop + i);
        ctx.stroke();
    }

    // Cabin (rear section ~35%)
    const cabY = flip ? (cy + p.bl * 0.12) : (cy - p.bl / 2);
    const cabH = p.bl * 0.36;
    fillRR(ctx, cx - p.bw / 2 + 3, cabY, p.bw - 6, cabH, 3, c.cabin);
    // Cabin glass roof
    fillRR(ctx, cx - p.bw / 2 + 5, cabY + 2, p.bw - 10, cabH - 4, 2, 'rgba(100,185,255,0.50)');
    // Glass reflection
    drawGlassHighlight(ctx, cx - p.bw / 4, cabY + 3, p.bw / 3, 2);

    // Accent stripe / Brand Identity
    ctx.fillStyle = c.accent;
    if (c.brandId === 'jd') {
        ctx.fillRect(cx - p.bw / 2 + 2, hTop, 2, hH);
        ctx.fillRect(cx + p.bw / 2 - 4, hTop, 2, hH);
    } else if (c.brandId === 'case') {
        ctx.fillRect(cx - p.bw / 4, flip ? hTop : hTop + hH - 4, p.bw / 2, 4);
    } else {
        ctx.fillRect(cx - p.bw / 2, cy - 1, p.bw, 2);
    }

    // Exhaust pipe (lado direto do capô)
    const exY = cy + d * p.bl * 0.1;
    drawCircle(ctx, cx + p.bw / 2 + 1, exY, 2.5, '#bdc3c7'); // Outer pipe
    drawCircle(ctx, cx + p.bw / 2 + 1, exY, 1.5, '#2c3e50'); // Inner hole

    // Beacons (Giroflex)
    const bY = flip ? cabY + cabH - 3 : cabY + 3;
    drawCircle(ctx, cx - p.bw / 2 + 2, bY, 1.5, '#f39c12');
    drawCircle(ctx, cx + p.bw / 2 - 2, bY, 1.5, '#f39c12');

    // Headlights (front edge)
    const lY = cy + d * (p.bl / 2 - 2);
    drawCircle(ctx, cx - p.bw / 3, lY, 2, '#fffde7');
    drawCircle(ctx, cx + p.bw / 3, lY, 2, '#fffde7');

    // Tail lights (rear edge)
    const tY = cy - d * (p.bl / 2 - 2);
    drawCircle(ctx, cx - p.bw / 3, tY, 1.5, '#e74c3c');
    drawCircle(ctx, cx + p.bw / 3, tY, 1.5, '#e74c3c');
}

function drawTractorH(ctx, p, c, flip, cx, cy) {
    const d = flip ? -1 : 1;

    // Rear wheels (big)
    const rX = cx - d * p.bl * 0.15;
    drawWheel(ctx, rX - p.rwL / 2, cy - p.bw / 2 - p.rwW - 1, p.rwL, p.rwW, 'h');
    drawWheel(ctx, rX - p.rwL / 2, cy + p.bw / 2 + 1, p.rwL, p.rwW, 'h');
    if (c.dualRear) {
        drawWheel(ctx, rX - p.rwL / 2, cy - p.bw / 2 - p.rwW * 2 - 3, p.rwL, p.rwW, 'h');
        drawWheel(ctx, rX - p.rwL / 2, cy + p.bw / 2 + p.rwW + 3, p.rwL, p.rwW, 'h');
    }

    // Front wheels (small)
    const fX = cx + d * p.bl * 0.3;
    drawWheel(ctx, fX - p.fwL / 2, cy - p.bw / 2 + 1, p.fwL, p.fwW, 'h');
    drawWheel(ctx, fX - p.fwL / 2, cy + p.bw / 2 - p.fwW - 1, p.fwL, p.fwW, 'h');

    // Fenders over rear wheels
    const fenderX = rX - p.rwL / 2;
    fillRR(ctx, fenderX, cy - p.bw / 2 - p.rwW + 1, 3, p.rwW + 2, 1, c.accent);
    fillRR(ctx, fenderX, cy + p.bw / 2 - 2, 3, p.rwW + 2, 1, c.accent);

    // Main body
    fillRR(ctx, cx - p.bl / 2, cy - p.bw / 2, p.bl, p.bw, 4, c.body);
    drawGloss(ctx, cx - p.bl / 2, cy - p.bw / 2, p.bl, p.bw, 'h', 4);
    strokeRR(ctx, cx - p.bl / 2, cy - p.bw / 2, p.bl, p.bw, 4, 'rgba(255,255,255,0.1)', 1);

    // Hood (front section)
    const hLeft = flip ? (cx - p.bl / 2) : (cx + p.bl * 0.08);
    const hW = p.bl * 0.40;
    fillRR(ctx, hLeft, cy - p.bw / 2 + 2, hW, p.bw - 4, 2, c.hood);
    drawGloss(ctx, hLeft, cy - p.bw / 2 + 2, hW, p.bw - 4, 'h', 2);
    // Vents (vertical)
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.7;
    const ventStep = Math.max(3, Math.round(hW / 7));
    for (let i = 3; i < hW - 2; i += ventStep) {
        ctx.beginPath();
        ctx.moveTo(hLeft + i, cy - p.bw / 2 + 5);
        ctx.lineTo(hLeft + i, cy + p.bw / 2 - 5);
        ctx.stroke();
    }

    // Cabin
    const cabX = flip ? (cx + p.bl * 0.12) : (cx - p.bl / 2);
    const cabW = p.bl * 0.36;
    fillRR(ctx, cabX, cy - p.bw / 2 + 3, cabW, p.bw - 6, 3, c.cabin);
    fillRR(ctx, cabX + 2, cy - p.bw / 2 + 5, cabW - 4, p.bw - 10, 2, 'rgba(100,185,255,0.50)');
    drawGlassHighlight(ctx, cabX + 3, cy - p.bw / 4, 2, p.bw / 3);

    // Accent stripe / Brand Identity
    ctx.fillStyle = c.accent;
    if (c.brandId === 'jd') {
        ctx.fillRect(hLeft, cy - p.bw / 2 + 2, hW, 2);
        ctx.fillRect(hLeft, cy + p.bw / 2 - 4, hW, 2);
    } else if (c.brandId === 'case') {
        ctx.fillRect(flip ? hLeft : hLeft + hW - 4, cy - p.bw / 4, 4, p.bw / 2);
    } else {
        ctx.fillRect(cx - 1, cy - p.bw / 2, 2, p.bw);
    }

    // Exhaust
    const exX = cx + d * p.bl * 0.1;
    drawCircle(ctx, exX, cy + p.bw / 2 + 1, 2.5, '#bdc3c7');
    drawCircle(ctx, exX, cy + p.bw / 2 + 1, 1.5, '#2c3e50');

    // Beacons (Giroflex)
    const bX = flip ? cabX + cabW - 3 : cabX + 3;
    drawCircle(ctx, bX, cy - p.bw / 2 + 2, 1.5, '#f39c12');
    drawCircle(ctx, bX, cy + p.bw / 2 - 2, 1.5, '#f39c12');

    // Headlights
    const lX = cx + d * (p.bl / 2 - 2);
    drawCircle(ctx, lX, cy - p.bw / 3, 2, '#fffde7');
    drawCircle(ctx, lX, cy + p.bw / 3, 2, '#fffde7');

    // Tail lights
    const tX = cx - d * (p.bl / 2 - 2);
    drawCircle(ctx, tX, cy - p.bw / 3, 1.5, '#e74c3c');
    drawCircle(ctx, tX, cy + p.bw / 3, 1.5, '#e74c3c');
}

// ============================================================
//  HARVESTER DRAWING
// ============================================================
function drawHarvester(ctx, raw, dir, cw, ch) {
    const s = raw.canvas;
    const cx = cw / 2, cy = ch / 2;
    const p = {
        bw: Math.round(s * raw.bodyW), bl: Math.round(s * raw.bodyL),
        hdrW: Math.round(s * raw.headerW), hdrH: Math.round(s * raw.headerH),
        rwW: Math.round(s * raw.rwW), rwL: Math.round(s * raw.rwL),
        fwW: Math.round(s * raw.fwW), fwL: Math.round(s * raw.fwL),
    };
    const isV = dir === 'down' || dir === 'up';

    const so = { down: [3, 4], up: [-3, -4], left: [-4, 3], right: [4, 3] }[dir];
    const sw = isV ? Math.max(p.bw, p.hdrW) + 8 : p.bl + p.hdrH + 10;
    const sh = isV ? p.bl + p.hdrH + 10 : Math.max(p.bw, p.hdrW) + 8;
    drawShadow(ctx, cx - sw / 2 + so[0], cy - sh / 2 + so[1], sw, sh, 5);

    if (isV) {
        drawHarvesterV(ctx, p, raw, dir === 'up', cx, cy);
    } else {
        drawHarvesterH(ctx, p, raw, dir === 'left', cx, cy);
    }
}

function drawHarvesterV(ctx, p, c, flip, cx, cy) {
    const d = flip ? -1 : 1;

    // Rear wheels (big)
    const rY = cy - d * p.bl * 0.20;
    drawWheel(ctx, cx - p.bw / 2 - p.rwW - 1, rY - p.rwL / 2, p.rwW, p.rwL, 'v');
    drawWheel(ctx, cx + p.bw / 2 + 1, rY - p.rwL / 2, p.rwW, p.rwL, 'v');

    // Front casters (small)
    const fY = cy + d * p.bl * 0.32;
    drawWheel(ctx, cx - p.bw / 4 - p.fwW / 2, fY - p.fwL / 2, p.fwW, p.fwL, 'v');
    drawWheel(ctx, cx + p.bw / 4 - p.fwW / 2, fY - p.fwL / 2, p.fwW, p.fwL, 'v');

    // Main body (grain tank)
    fillRR(ctx, cx - p.bw / 2, cy - p.bl / 2, p.bw, p.bl, 4, c.body);
    drawGloss(ctx, cx - p.bw / 2, cy - p.bl / 2, p.bw, p.bl, 'v', 4);
    strokeRR(ctx, cx - p.bw / 2, cy - p.bl / 2, p.bw, p.bl, 4, 'rgba(0,0,0,0.1)', 1);

    // Grain tank top detail
    fillRR(ctx, cx - p.bw / 2 + 3, cy - p.bl * 0.15, p.bw - 6, p.bl * 0.32, 2, c.tank);

    // Tank lid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx, cy - p.bl * 0.13);
    ctx.lineTo(cx, cy + p.bl * 0.15);
    ctx.stroke();

    // Cabin (rear)
    const cabY = flip ? (cy + p.bl * 0.08) : (cy - p.bl / 2);
    const cabH = p.bl * 0.38;
    fillRR(ctx, cx - p.bw / 2 + 2, cabY, p.bw - 4, cabH, 3, c.cabin);
    fillRR(ctx, cx - p.bw / 2 + 4, cabY + 2, p.bw - 8, cabH - 4, 2, 'rgba(100,185,255,0.50)');
    drawGlassHighlight(ctx, cx - p.bw / 4, cabY + 3, p.bw / 3, 2);

    // Accent stripe / Brand Identity
    ctx.fillStyle = c.accent;
    if (c.brandId === 'jd') {
        ctx.fillRect(cx - p.bw / 2 + 2, cy - p.bl * 0.15, 2, p.bl * 0.32);
        ctx.fillRect(cx + p.bw / 2 - 4, cy - p.bl * 0.15, 2, p.bl * 0.32);
    } else if (c.brandId === 'case' || c.brandId === 'mf') {
        ctx.fillRect(cx - p.bw / 2, cy, p.bw, 3);
    } else {
        ctx.fillRect(cx - p.bw / 4, cy, p.bw / 2, 2);
    }

    // Exhaust pipe
    const exY = cy - d * p.bl * 0.05;
    drawCircle(ctx, cx + p.bw / 2 - 2, exY, 3, '#bdc3c7');
    drawCircle(ctx, cx + p.bw / 2 - 2, exY, 1.5, '#222');

    // Beacons (Giroflex)
    const bY = flip ? cabY + cabH - 3 : cabY + 3;
    drawCircle(ctx, cx - p.bw / 2 + 3, bY, 1.5, '#f39c12');
    drawCircle(ctx, cx + p.bw / 2 - 3, bY, 1.5, '#f39c12');

    // Cutter bar / header (front)
    const headerY = cy + d * (p.bl / 2 + 2);
    const hdrTop = flip ? headerY - p.hdrH : headerY;
    fillRR(ctx, cx - p.hdrW / 2, hdrTop, p.hdrW, p.hdrH, 2, c.header);
    // Reel bars on header
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1;
    const barCount = Math.round(p.hdrW / 8);
    for (let i = 0; i < barCount; i++) {
        const bx = cx - p.hdrW / 2 + 4 + i * (p.hdrW - 8) / Math.max(1, barCount - 1);
        ctx.beginPath();
        ctx.moveTo(bx, hdrTop + 1);
        ctx.lineTo(bx, hdrTop + p.hdrH - 1);
        ctx.stroke();
    }

    // Unloading auger (pipe to one side)
    const augerX = cx + p.bw / 2 + 2;
    const augerY1 = cy - d * p.bl * 0.1;
    const augerY2 = cy - d * p.bl * 0.35;
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(augerX, augerY1);
    ctx.lineTo(augerX + 4, augerY2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(augerX, augerY1);
    ctx.lineTo(augerX + 4, augerY2);
    ctx.stroke();

    // Headlights at front
    const lY = cy + d * (p.bl / 2 - 1);
    drawCircle(ctx, cx - p.bw / 3, lY, 1.5, '#FFEB3B');
    drawCircle(ctx, cx + p.bw / 3, lY, 1.5, '#FFEB3B');
}

function drawHarvesterH(ctx, p, c, flip, cx, cy) {
    const d = flip ? -1 : 1;

    // Rear wheels
    const rX = cx - d * p.bl * 0.20;
    drawWheel(ctx, rX - p.rwL / 2, cy - p.bw / 2 - p.rwW - 1, p.rwL, p.rwW, 'h');
    drawWheel(ctx, rX - p.rwL / 2, cy + p.bw / 2 + 1, p.rwL, p.rwW, 'h');

    // Front casters
    const fX = cx + d * p.bl * 0.32;
    drawWheel(ctx, fX - p.fwL / 2, cy - p.bw / 4 - p.fwW / 2, p.fwL, p.fwW, 'h');
    drawWheel(ctx, fX - p.fwL / 2, cy + p.bw / 4 - p.fwW / 2, p.fwL, p.fwW, 'h');

    // Main body
    fillRR(ctx, cx - p.bl / 2, cy - p.bw / 2, p.bl, p.bw, 4, c.body);
    drawGloss(ctx, cx - p.bl / 2, cy - p.bw / 2, p.bl, p.bw, 'h', 4);
    strokeRR(ctx, cx - p.bl / 2, cy - p.bw / 2, p.bl, p.bw, 4, 'rgba(0,0,0,0.1)', 1);

    // Grain tank detail
    fillRR(ctx, cx - p.bl * 0.15, cy - p.bw / 2 + 3, p.bl * 0.32, p.bw - 6, 2, c.tank);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx - p.bl * 0.13, cy);
    ctx.lineTo(cx + p.bl * 0.15, cy);
    ctx.stroke();

    // Cabin
    const cabX = flip ? (cx + p.bl * 0.08) : (cx - p.bl / 2);
    const cabW = p.bl * 0.38;
    fillRR(ctx, cabX, cy - p.bw / 2 + 2, cabW, p.bw - 4, 3, c.cabin);
    fillRR(ctx, cabX + 2, cy - p.bw / 2 + 4, cabW - 4, p.bw - 8, 2, 'rgba(100,185,255,0.50)');
    drawGlassHighlight(ctx, cabX + 3, cy - p.bw / 4, 2, p.bw / 3);

    // Accent stripe / Brand Identity
    ctx.fillStyle = c.accent;
    if (c.brandId === 'jd') {
        ctx.fillRect(cx - p.bl * 0.15, cy - p.bw / 2 + 2, p.bl * 0.32, 2);
        ctx.fillRect(cx - p.bl * 0.15, cy + p.bw / 2 - 4, p.bl * 0.32, 2);
    } else if (c.brandId === 'case' || c.brandId === 'mf') {
        ctx.fillRect(cx, cy - p.bw / 2, 3, p.bw);
    } else {
        ctx.fillRect(cx, cy - p.bw / 4, 2, p.bw / 2);
    }

    // Exhaust
    const exX = cx - d * p.bl * 0.05;
    drawCircle(ctx, exX, cy + p.bw / 2 - 2, 3, '#bdc3c7');
    drawCircle(ctx, exX, cy + p.bw / 2 - 2, 1.5, '#222');

    // Beacons (Giroflex)
    const bX = flip ? cabX + cabW - 3 : cabX + 3;
    drawCircle(ctx, bX, cy - p.bw / 2 + 3, 1.5, '#f39c12');
    drawCircle(ctx, bX, cy + p.bw / 2 - 3, 1.5, '#f39c12');

    // Header
    const headerX = cx + d * (p.bl / 2 + 2);
    const hdrLeft = flip ? headerX - p.hdrH : headerX;
    fillRR(ctx, hdrLeft, cy - p.hdrW / 2, p.hdrH, p.hdrW, 2, c.header);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1;
    const barCount = Math.round(p.hdrW / 8);
    for (let i = 0; i < barCount; i++) {
        const by = cy - p.hdrW / 2 + 4 + i * (p.hdrW - 8) / Math.max(1, barCount - 1);
        ctx.beginPath();
        ctx.moveTo(hdrLeft + 1, by);
        ctx.lineTo(hdrLeft + p.hdrH - 1, by);
        ctx.stroke();
    }

    // Auger
    const augerY = cy + p.bw / 2 + 2;
    const augerX1 = cx - d * p.bl * 0.1;
    const augerX2 = cx - d * p.bl * 0.35;
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(augerX1, augerY);
    ctx.lineTo(augerX2, augerY + 4);
    ctx.stroke();

    // Headlights
    const lX = cx + d * (p.bl / 2 - 1);
    drawCircle(ctx, lX, cy - p.bw / 3, 1.5, '#FFEB3B');
    drawCircle(ctx, lX, cy + p.bw / 3, 1.5, '#FFEB3B');
}

// ============================================================
//  TRUCK DRAWING
// ============================================================
function drawTruck(ctx, raw, dir, cw, ch) {
    const s = raw.canvas;
    const cx = cw / 2, cy = ch / 2;
    const p = {
        cabW: Math.round(s * raw.cabW), cabL: Math.round(s * raw.cabL),
        cgW: Math.round(s * raw.cargoW), cgL: Math.round(s * raw.cargoL),
        wW: Math.round(s * raw.wheelW), wL: Math.round(s * raw.wheelL),
    };
    const isV = dir === 'down' || dir === 'up';

    const totalL = p.cabL + p.cgL + 2;
    const so = { down: [2, 3], up: [-2, -3], left: [-3, 2], right: [3, 2] }[dir];
    const sw = isV ? Math.max(p.cabW, p.cgW) + 8 : totalL + 8;
    const sh = isV ? totalL + 8 : Math.max(p.cabW, p.cgW) + 8;
    drawShadow(ctx, cx - sw / 2 + so[0], cy - sh / 2 + so[1], sw, sh, 5);

    if (isV) {
        drawTruckV(ctx, p, raw, dir === 'up', cx, cy);
    } else {
        drawTruckH(ctx, p, raw, dir === 'left', cx, cy);
    }
}

function drawTruckV(ctx, p, c, flip, cx, cy) {
    const d = flip ? -1 : 1;
    const totalL = p.cabL + p.cgL + 2;

    // Cargo bed (rear section)
    const cargoStart = cy - d * totalL / 2;
    const cargoEnd = cargoStart + d * p.cgL;
    const cargoTop = Math.min(cargoStart, cargoEnd);
    fillRR(ctx, cx - p.cgW / 2, cargoTop, p.cgW, p.cgL, 3, c.cargo);
    drawGloss(ctx, cx - p.cgW / 2, cargoTop, p.cgW, p.cgL, 'v', 3);
    strokeRR(ctx, cx - p.cgW / 2, cargoTop, p.cgW, p.cgL, 3, 'rgba(0,0,0,0.15)', 1);
    // Cargo bed rails
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.6;
    const railSpacing = Math.round(p.cgL / 4);
    for (let i = railSpacing; i < p.cgL; i += railSpacing) {
        ctx.beginPath();
        ctx.moveTo(cx - p.cgW / 2 + 2, cargoTop + i);
        ctx.lineTo(cx + p.cgW / 2 - 2, cargoTop + i);
        ctx.stroke();
    }

    // Cab (front section)
    const cabStart = cy + d * (totalL / 2 - p.cabL);
    const cabEnd = cy + d * totalL / 2;
    const cabTop = Math.min(cabStart, cabEnd);
    fillRR(ctx, cx - p.cabW / 2, cabTop, p.cabW, p.cabL, 3, c.cab);
    // Windshield
    fillRR(ctx, cx - p.cabW / 2 + 3, cabTop + 2, p.cabW - 6, p.cabL - 4, 1, c.glass);
    fillRR(ctx, cx - p.cabW / 2 + 4, cabTop + 3, p.cabW - 8, p.cabL * 0.5, 2, 'rgba(100,185,255,0.45)');
    drawGlassHighlight(ctx, cx - p.cabW / 4, cabTop + 3, p.cabW / 3, 2);

    // Front Grille / Brand Identity
    ctx.fillStyle = c.accent;
    const grilleY = flip ? cabEnd - 4 : cabStart;
    if (c.brandId === 'scania') {
        ctx.fillRect(cx - p.cabW / 4, grilleY, p.cabW / 2, 4);
    } else if (c.brandId === 'vw') {
        ctx.fillRect(cx - p.cabW / 3, grilleY + (flip ? 2 : 1), p.cabW / 1.5, 2);
    } else {
        ctx.fillRect(cx - p.cabW / 3.5, grilleY, p.cabW / 1.75, 3);
    }

    // Front wheels (under cab)
    const fwY = cabTop + p.cabL / 2;
    drawWheel(ctx, cx - p.cabW / 2 - p.wW, fwY - p.wL / 2, p.wW, p.wL, 'v');
    drawWheel(ctx, cx + p.cabW / 2, fwY - p.wL / 2, p.wW, p.wL, 'v');

    // Rear dual wheels (under cargo back)
    const rwY = cargoTop + p.cgL * 0.65;
    drawWheel(ctx, cx - p.cgW / 2 - p.wW, rwY - p.wL / 2, p.wW, p.wL, 'v');
    drawWheel(ctx, cx + p.cgW / 2, rwY - p.wL / 2, p.wW, p.wL, 'v');
    // Inner dual wheels
    drawWheel(ctx, cx - p.cgW / 2 - p.wW * 2 - 1, rwY - p.wL / 2, p.wW, p.wL, 'v');
    drawWheel(ctx, cx + p.cgW / 2 + p.wW + 1, rwY - p.wL / 2, p.wW, p.wL, 'v');

    // Exhaust (behind cab)
    const exY = flip ? cabStart - 2 : cabEnd + 2;
    drawCircle(ctx, cx + p.cabW / 2 + 1, exY, 2.5, '#bdc3c7');
    drawCircle(ctx, cx + p.cabW / 2 + 1, exY, 1.5, '#222');

    // Beacons / Cab lights
    const roofY = flip ? cabTop + p.cabL / 2 + 3 : cabTop + p.cabL / 2 - 3;
    drawCircle(ctx, cx - p.cabW / 3, roofY, 1.5, '#f39c12');
    drawCircle(ctx, cx + p.cabW / 3, roofY, 1.5, '#f39c12');

    // Headlights
    const lY = flip ? cabEnd : cabStart;
    drawCircle(ctx, cx - p.cabW / 3, lY, 2, '#fffde7');
    drawCircle(ctx, cx + p.cabW / 3, lY, 2, '#fffde7');

    // Tail lights
    const tY = flip ? cargoStart : cargoEnd;
    drawCircle(ctx, cx - p.cgW / 3, tY, 1.5, '#e74c3c');
    drawCircle(ctx, cx + p.cgW / 3, tY, 1.5, '#e74c3c');
}

function drawTruckH(ctx, p, c, flip, cx, cy) {
    const d = flip ? -1 : 1;
    const totalL = p.cabL + p.cgL + 2;

    // Cargo bed
    const cargoStart = cx - d * totalL / 2;
    const cargoEnd = cargoStart + d * p.cgL;
    const cargoLeft = Math.min(cargoStart, cargoEnd);
    fillRR(ctx, cargoLeft, cy - p.cgW / 2, p.cgL, p.cgW, 3, c.cargo);
    drawGloss(ctx, cargoLeft, cy - p.cgW / 2, p.cgL, p.cgW, 'h', 3);
    strokeRR(ctx, cargoLeft, cy - p.cgW / 2, p.cgL, p.cgW, 3, 'rgba(0,0,0,0.15)', 1);
    // Rails
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.6;
    const railSpacing = Math.round(p.cgL / 4);
    for (let i = railSpacing; i < p.cgL; i += railSpacing) {
        ctx.beginPath();
        ctx.moveTo(cargoLeft + i, cy - p.cgW / 2 + 2);
        ctx.lineTo(cargoLeft + i, cy + p.cgW / 2 - 2);
        ctx.stroke();
    }

    // Cab
    const cabStart = cx + d * (totalL / 2 - p.cabL);
    const cabEnd = cx + d * totalL / 2;
    const cabLeft = Math.min(cabStart, cabEnd);
    fillRR(ctx, cabLeft, cy - p.cabW / 2, p.cabL, p.cabW, 3, c.cab);
    fillRR(ctx, cabLeft + 2, cy - p.cabW / 2 + 3, p.cabL - 4, p.cabW - 6, 2, c.glass);
    fillRR(ctx, cabLeft + 3, cy - p.cabW / 2 + 4, p.cabL * 0.5, p.cabW - 8, 2, 'rgba(100,185,255,0.45)');
    drawGlassHighlight(ctx, cabLeft + 3, cy - p.cabW / 4, 2, p.cabW / 3);

    // Front wheels
    const fwX = cabLeft + p.cabL / 2;
    drawWheel(ctx, fwX - p.wL / 2, cy - p.cabW / 2 - p.wW, p.wL, p.wW, 'h');
    drawWheel(ctx, fwX - p.wL / 2, cy + p.cabW / 2, p.wL, p.wW, 'h');

    // Rear dual wheels
    const rwX = cargoLeft + p.cgL * 0.65;
    drawWheel(ctx, rwX - p.wL / 2, cy - p.cgW / 2 - p.wW, p.wL, p.wW, 'h');
    drawWheel(ctx, rwX - p.wL / 2, cy + p.cgW / 2, p.wL, p.wW, 'h');
    drawWheel(ctx, rwX - p.wL / 2, cy - p.cgW / 2 - p.wW * 2 - 1, p.wL, p.wW, 'h');
    drawWheel(ctx, rwX - p.wL / 2, cy + p.cgW / 2 + p.wW + 1, p.wL, p.wW, 'h');

    // Windshield
    fillRR(ctx, flip ? cabLeft : cabLeft + 4, cy - p.cabW / 2 + 3, p.cabL - 4, p.cabW - 6, 1, c.glass);
    drawGlassHighlight(ctx, flip ? cabLeft : cabLeft + 4, cy - p.cabW / 2 + 3, p.cabL - 4, 2);

    // Front Grille / Brand Identity
    ctx.fillStyle = c.accent;
    const grilleX = flip ? cabEnd - 4 : cabStart;
    if (c.brandId === 'scania') {
        ctx.fillRect(grilleX, cy - p.cabW / 4, 4, p.cabW / 2);
    } else if (c.brandId === 'vw') {
        ctx.fillRect(grilleX + (flip ? 2 : 1), cy - p.cabW / 3, 2, p.cabW / 1.5);
    } else {
        ctx.fillRect(grilleX, cy - p.cabW / 3.5, 3, p.cabW / 1.75);
    }

    // Exhaust (behind cab)
    const exX = flip ? cabStart - 2 : cabEnd + 2;
    drawCircle(ctx, exX, cy + p.cabW / 2 - 2, 2.5, '#bdc3c7');
    drawCircle(ctx, exX, cy + p.cabW / 2 - 2, 1.5, '#222');

    // Beacons / Cab lights
    const roofX = flip ? cabLeft + p.cabL / 2 + 3 : cabLeft + p.cabL / 2 - 3;
    drawCircle(ctx, roofX, cy - p.cabW / 3, 1.5, '#f39c12');
    drawCircle(ctx, roofX, cy + p.cabW / 3, 1.5, '#f39c12');

    // Headlights
    const lX = flip ? cabEnd : cabStart;
    drawCircle(ctx, lX, cy - p.cabW / 3, 2, '#fffde7');
    drawCircle(ctx, lX, cy + p.cabW / 3, 2, '#fffde7');

    // Tail lights
    const tX = flip ? cargoStart : cargoEnd;
    drawCircle(ctx, tX, cy - p.cgW / 3, 1.5, '#e74c3c');
    drawCircle(ctx, tX, cy + p.cgW / 3, 1.5, '#e74c3c');

    // Accent stripe
    ctx.fillStyle = c.accent;
    ctx.fillRect(cabLeft + p.cabL - 2, cy - p.cabW / 2 + 1, 2, p.cabW - 2);
}

// ============================================================
//  IMPLEMENT DRAWING
// ============================================================
function drawPlow(ctx, raw, dir, cw, ch) {
    const cx = cw / 2, cy = ch / 2;
    const s = raw.canvas;
    const w = Math.round(s * raw.w);
    const l = Math.round(s * raw.l);
    const isV = dir === 'down' || dir === 'up';
    const flip = dir === 'up' || dir === 'left';

    // Shadow
    const so = { down: [1, 2], up: [-1, -2], left: [-2, 1], right: [2, 1] }[dir];
    const dw = isV ? w : l;
    const dl = isV ? l : w;
    drawShadow(ctx, cx - dw / 2 + so[0] - 1, cy - dl / 2 + so[1] - 1, dw + 2, dl + 2, 3);

    if (isV) { drawPlowV(ctx, raw, w, l, flip, cx, cy); }
    else { drawPlowH(ctx, raw, w, l, flip, cx, cy); }
}

function drawPlowV(ctx, r, w, l, flip, cx, cy) {
    const d = flip ? -1 : 1;
    // Hitch bar (rear/connection side)
    const hitchY = cy - d * l / 2;
    ctx.fillStyle = r.metal;
    ctx.fillRect(cx - 2, Math.min(hitchY, cy), 4, Math.abs(hitchY - cy) * 0.3);
    // Main frame bar
    ctx.fillStyle = r.frame;
    ctx.fillRect(cx - w / 2, cy - 2, w, 4);
    // Discs
    const spacing = w / (r.count + 1);
    for (let i = 1; i <= r.count; i++) {
        const dx = cx - w / 2 + spacing * i;
        const dy = cy + d * l * 0.15;
        // Disc shape (oval)
        ctx.fillStyle = r.disc;
        ctx.beginPath();
        ctx.ellipse(dx, dy, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        // Arm connecting disc to frame
        ctx.strokeStyle = r.metal;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(dx, cy);
        ctx.lineTo(dx, dy);
        ctx.stroke();
    }
}

function drawPlowH(ctx, r, w, l, flip, cx, cy) {
    const d = flip ? -1 : 1;
    const hitchX = cx - d * l / 2;
    ctx.fillStyle = r.metal;
    ctx.fillRect(Math.min(hitchX, cx), cy - 2, Math.abs(hitchX - cx) * 0.3, 4);
    ctx.fillStyle = r.frame;
    ctx.fillRect(cx - 2, cy - w / 2, 4, w);
    const spacing = w / (r.count + 1);
    for (let i = 1; i <= r.count; i++) {
        const dy = cy - w / 2 + spacing * i;
        const dx = cx + d * l * 0.15;
        ctx.fillStyle = r.disc;
        ctx.beginPath();
        ctx.ellipse(dx, dy, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.strokeStyle = r.metal;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, dy);
        ctx.lineTo(dx, dy);
        ctx.stroke();
    }
}

function drawHarrow(ctx, raw, dir, cw, ch) {
    const cx = cw / 2, cy = ch / 2;
    const s = raw.canvas;
    const w = Math.round(s * raw.w);
    const l = Math.round(s * raw.l);
    const isV = dir === 'down' || dir === 'up';
    const flip = dir === 'up' || dir === 'left';

    const so = { down: [1, 2], up: [-1, -2], left: [-2, 1], right: [2, 1] }[dir];
    const dw = isV ? w : l;
    const dl = isV ? l : w;
    drawShadow(ctx, cx - dw / 2 + so[0] - 1, cy - dl / 2 + so[1] - 1, dw + 2, dl + 2, 3);

    if (isV) { drawHarrowV(ctx, raw, w, l, flip, cx, cy); }
    else { drawHarrowH(ctx, raw, w, l, flip, cx, cy); }
}

function drawHarrowV(ctx, r, w, l, flip, cx, cy) {
    const d = flip ? -1 : 1;
    // Hitch
    ctx.fillStyle = r.metal;
    ctx.fillRect(cx - 2, cy - d * l / 2, 4, d * l * 0.2);
    // Frame rectangle
    fillRR(ctx, cx - w / 2, cy - l / 2 + (flip ? 0 : l * 0.15), w, l * 0.7, 2, r.frame);
    strokeRR(ctx, cx - w / 2, cy - l / 2 + (flip ? 0 : l * 0.15), w, l * 0.7, 2, 'rgba(0,0,0,0.2)', 0.5);
    // Cross bars
    const frameTop = cy - l / 2 + (flip ? 0 : l * 0.15);
    const frameH = l * 0.7;
    ctx.strokeStyle = r.metal;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, frameTop + frameH / 3);
    ctx.lineTo(cx + w / 2, frameTop + frameH / 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, frameTop + frameH * 2 / 3);
    ctx.lineTo(cx + w / 2, frameTop + frameH * 2 / 3);
    ctx.stroke();
    // Teeth/tines
    const teethSpacing = w / (r.count + 1);
    for (let i = 1; i <= r.count; i++) {
        const tx = cx - w / 2 + teethSpacing * i;
        ctx.strokeStyle = r.disc;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tx, frameTop + 2);
        ctx.lineTo(tx, frameTop + frameH - 2);
        ctx.stroke();
        // Tooth tip
        drawCircle(ctx, tx, frameTop + frameH - 1, 1.2, r.disc);
    }
}

function drawHarrowH(ctx, r, w, l, flip, cx, cy) {
    const d = flip ? -1 : 1;
    ctx.fillStyle = r.metal;
    ctx.fillRect(cx - d * l / 2, cy - 2, d * l * 0.2, 4);
    const frameLeft = cx - l / 2 + (flip ? 0 : l * 0.15);
    const frameW = l * 0.7;
    fillRR(ctx, frameLeft, cy - w / 2, frameW, w, 2, r.frame);
    strokeRR(ctx, frameLeft, cy - w / 2, frameW, w, 2, 'rgba(0,0,0,0.2)', 0.5);
    ctx.strokeStyle = r.metal;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(frameLeft + frameW / 3, cy - w / 2);
    ctx.lineTo(frameLeft + frameW / 3, cy + w / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(frameLeft + frameW * 2 / 3, cy - w / 2);
    ctx.lineTo(frameLeft + frameW * 2 / 3, cy + w / 2);
    ctx.stroke();
    const teethSpacing = w / (r.count + 1);
    for (let i = 1; i <= r.count; i++) {
        const ty = cy - w / 2 + teethSpacing * i;
        ctx.strokeStyle = r.disc;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(frameLeft + 2, ty);
        ctx.lineTo(frameLeft + frameW - 2, ty);
        ctx.stroke();
        drawCircle(ctx, frameLeft + frameW - 1, ty, 1.2, r.disc);
    }
}

function drawSeeder(ctx, raw, dir, cw, ch) {
    const cx = cw / 2, cy = ch / 2;
    const s = raw.canvas;
    const w = Math.round(s * raw.w);
    const l = Math.round(s * raw.l);
    const isV = dir === 'down' || dir === 'up';
    const flip = dir === 'up' || dir === 'left';

    const so = { down: [1, 2], up: [-1, -2], left: [-2, 1], right: [2, 1] }[dir];
    const dw = isV ? w : l;
    const dl = isV ? l : w;
    drawShadow(ctx, cx - dw / 2 + so[0] - 1, cy - dl / 2 + so[1] - 1, dw + 2, dl + 2, 3);

    if (isV) { drawSeederV(ctx, raw, w, l, flip, cx, cy); }
    else { drawSeederH(ctx, raw, w, l, flip, cx, cy); }
}

function drawSeederV(ctx, r, w, l, flip, cx, cy) {
    const d = flip ? -1 : 1;
    // Hitch
    ctx.fillStyle = r.metal;
    ctx.fillRect(cx - 2, cy - d * l / 2, 4, d * l * 0.18);
    // Main box (seed hopper)
    const boxH = l * 0.50;
    const boxY = cy - boxH / 2 - d * l * 0.05;
    fillRR(ctx, cx - w / 2, boxY, w, boxH, 3, r.frame);
    strokeRR(ctx, cx - w / 2, boxY, w, boxH, 3, 'rgba(0,0,0,0.15)', 1);
    // Seed compartments
    const compW = w / r.count;
    for (let i = 0; i < r.count; i++) {
        const cmpX = cx - w / 2 + compW * i + 2;
        fillRR(ctx, cmpX, boxY + 3, compW - 4, boxH - 6, 2, r.disc);
        strokeRR(ctx, cmpX, boxY + 3, compW - 4, boxH - 6, 2, 'rgba(0,0,0,0.12)', 0.5);
    }
    // Seed tubes going down (front direction)
    const tubeY = boxY + (d > 0 ? boxH : 0);
    const tubeEnd = tubeY + d * l * 0.22;
    for (let i = 0; i < r.count; i++) {
        const tx = cx - w / 2 + compW * (i + 0.5);
        ctx.strokeStyle = r.metal;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, tubeY);
        ctx.lineTo(tx, tubeEnd);
        ctx.stroke();
        // Disc opener at end
        drawCircle(ctx, tx, tubeEnd, 2, r.disc);
    }
    // Small transport wheels
    const whlY = boxY + boxH / 2;
    drawWheel(ctx, cx - w / 2 - 4, whlY - 3, 3, 6, 'v');
    drawWheel(ctx, cx + w / 2 + 1, whlY - 3, 3, 6, 'v');
}

function drawSeederH(ctx, r, w, l, flip, cx, cy) {
    const d = flip ? -1 : 1;
    ctx.fillStyle = r.metal;
    ctx.fillRect(cx - d * l / 2, cy - 2, d * l * 0.18, 4);
    const boxW = l * 0.50;
    const boxX = cx - boxW / 2 - d * l * 0.05;
    fillRR(ctx, boxX, cy - w / 2, boxW, w, 3, r.frame);
    strokeRR(ctx, boxX, cy - w / 2, boxW, w, 3, 'rgba(0,0,0,0.15)', 1);
    const compH = w / r.count;
    for (let i = 0; i < r.count; i++) {
        const cmpY = cy - w / 2 + compH * i + 2;
        fillRR(ctx, boxX + 3, cmpY, boxW - 6, compH - 4, 2, r.disc);
        strokeRR(ctx, boxX + 3, cmpY, boxW - 6, compH - 4, 2, 'rgba(0,0,0,0.12)', 0.5);
    }
    const tubeX = boxX + (d > 0 ? boxW : 0);
    const tubeEnd = tubeX + d * l * 0.22;
    for (let i = 0; i < r.count; i++) {
        const ty = cy - w / 2 + compH * (i + 0.5);
        ctx.strokeStyle = r.metal;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tubeX, ty);
        ctx.lineTo(tubeEnd, ty);
        ctx.stroke();
        drawCircle(ctx, tubeEnd, ty, 2, r.disc);
    }
    const whlX = boxX + boxW / 2;
    drawWheel(ctx, whlX - 3, cy - w / 2 - 4, 6, 3, 'h');
    drawWheel(ctx, whlX - 3, cy + w / 2 + 1, 6, 3, 'h');
}

// ============================================================
//  MAIN GENERATOR
// ============================================================
function genVehicle(scene, id, def, drawFn) {
    const s = def.canvas;
    const key = 'v_' + id;
    const ct = scene.textures.createCanvas(key, s, s);
    const ctx = ct.context;
    ctx.clearRect(0, 0, s, s);
    // Draw only facing RIGHT (0 degrees in Phaser rotation)
    drawFn(ctx, def, 'right', s, s);
    ct.refresh();
}

function genImplement(scene, id, def, drawFn) {
    const s = def.canvas;
    const key = 'impl_' + id;
    const ct = scene.textures.createCanvas(key, s, s);
    const ctx = ct.context;
    ctx.clearRect(0, 0, s, s);
    drawFn(ctx, def, 'right', s, s);
    ct.refresh();
}

window.generateAllSprites = function (scene) {
    // Tractors
    Object.keys(TRACTORS).forEach(function (id) { genVehicle(scene, id, TRACTORS[id], drawTractor); });
    // Harvesters
    Object.keys(HARVESTERS).forEach(function (id) { genVehicle(scene, id, HARVESTERS[id], drawHarvester); });
    // Trucks
    Object.keys(TRUCKS).forEach(function (id) { genVehicle(scene, id, TRUCKS[id], drawTruck); });
    // Implements
    Object.keys(IMPLS).forEach(function (id) {
        var drawFn;
        switch (IMPLS[id].type) {
            case 'plow': drawFn = drawPlow; break;
            case 'harrow': drawFn = drawHarrow; break;
            case 'seeder': drawFn = drawSeeder; break;
        }
        if (drawFn) genImplement(scene, id, IMPLS[id], drawFn);
    });
};

})();
