import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

missing_functions = """
async function fetchCatalog() {
    try {
        const d = await apiJson('/catalog');
        catalog = d;
        console.log("Catálogo carregado:", catalog);
    } catch (e) {
        console.warn("Erro ao carregar catálogo:", e);
    }
}

async function fetchState() {
    if (multiplayerMode) return; // In multiplayer, state is pushed via socket
    try {
        const d = await apiJson('/state');
        lastState = d;
        isHydrated = true;
        updateHUD(lastState);
        updateSoil(lastState.farm.soil);
        updateCrops(lastState.farm.plantedCrops);
    } catch (e) {
        console.warn("Erro ao carregar estado:", e);
    }
}

async function advanceHour() {
    if (multiplayerMode) return;
    try {
        const d = await apiJson('/tick', { method: 'POST' });
        if (d.success) await fetchState();
    } catch (e) { }
}

function openShop() {
    shopOpen = true;
    const modal = document.getElementById('shop-modal');
    if (modal) modal.style.display = 'flex';
    document.getElementById('shop-money').innerText = lastState?.farm?.money || 0;
    switchTab('vehicles');
}

function closeShop() {
    shopOpen = false;
    const modal = document.getElementById('shop-modal');
    if (modal) modal.style.display = 'none';
    fetchState();
}

function switchTab(cat) {
    if (!catalog) return;
    const cont = document.getElementById('shop-items');
    const tabs = document.querySelectorAll('.shop-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (cat === 'vehicles') tabs[0].classList.add('active');
    else if (cat === 'implements') tabs[1].classList.add('active');
    else if (cat === 'seeds') tabs[2].classList.add('active');

    let html = '';
    const items = catalog[cat];
    for (const id in items) {
        const item = items[id];
        html += `
            <div class="shop-item">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
                <div class="item-desc">${item.desc || ''}</div>
                <button onclick="buyItem('${cat}', '${id}')">Comprar</button>
            </div>
        `;
    }
    cont.innerHTML = html;
}

async function buyItem(cat, id) {
    if (multiplayerMode) {
        socket.emit('shopBuy', { category: cat, itemId: id });
        return;
    }
    try {
        const d = await apiJson('/shop/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) {
            showToast('Compra realizada!', 'success');
            await fetchState();
            const elMoney = document.getElementById('shop-money');
            if (elMoney) elMoney.innerText = lastState.farm.money;
            ensureVehicles();
            ensureImplements();
        } else {
            showToast(d.error || 'Saldo insuficiente', 'error');
        }
    } catch (e) { }
}

function closeSellMenu() {
    const sellModal = document.getElementById('sell-modal');
    if (sellModal) sellModal.style.display = 'none';
}

async function sellItem(cat, idx) {
    if (multiplayerMode) {
        socket.emit('shopSell', { category: cat, index: idx });
        return;
    }
    try {
        const d = await apiJson('/shop/sell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, index: idx })
        });
        if (d.success) {
            showToast('Item vendido!', 'success');
            await fetchState();
            renderSellMenu(cat);
            ensureVehicles();
            ensureImplements();
        }
    } catch (e) { }
}

function renderSellMenu(cat) {
    if (!catalog || !lastState) return;
    const cont = document.getElementById('sell-items');
    const tabs = document.querySelectorAll('.sell-tab');
    if (!cont || !tabs.length) return;
    
    tabs.forEach(t => t.classList.remove('active'));
    if (cat === 'vehicles') tabs[0].classList.add('active');
    else if (cat === 'implements') tabs[1].classList.add('active');

    let html = '';
    const inv = lastState.farm.inventory;
    const items = inv[cat];

    if (items.length === 0) {
        html = '<div style="color:#666; padding:20px;">Você não possui itens nesta categoria.</div>';
    } else {
        items.forEach((item, idx) => {
            const model = catalog[cat][item.modelId];
            const price = model ? Math.floor(model.price * 0.7) : 0;
            html += `
                <div class="shop-item">
                    <div class="item-name">${model ? model.name : item.modelId}</div>
                    <div class="item-price">Venda: $${price}</div>
                    <button onclick="sellItem('${cat}', ${idx})">Vender</button>
                </div>
            `;
        });
    }
    cont.innerHTML = html;
}
"""

# Insert before // Expose to HTML
target = r"// Expose to HTML"
content = content.replace(target, missing_functions + "\n" + target)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Restore done")
