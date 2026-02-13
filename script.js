const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSyhRUS6VfWR-5OMp07wLXBKSXWF_ojrrKBBo8HCek_6qgX9zC4bkklflC-vegUp0xC8zGZlvzsVh7I/pub?gid=1439213324&single=true&output=csv';

let allProducts = [];


let cart = JSON.parse(localStorage.getItem('SHOP_CART')) || []; //
// Clean function to handle quotes and spaces
const clean = (val) => val ? val.replace(/"/g, '').trim() : "";

// Global configuration for column numbers (1-based)
const col = {
    id: 1, name: 2, category: 3, subcategory: 4, material: 5,
    des1: 6, des2: 7, attr1: 8, attr2: 9, attr3: 10,
    unit: 11, sale: 12, mrp: 13, stock: 14, left: 15,
    img1: 16, img2: 17, img3: 18, img4: 19, vid: 20,
    minOrder: 21, isKit: 22, kitName: 23, kitComponents: 24, tagweb: 25
};

// Global helper to clean strings
/**
 * GLOBAL MAPPING ENGINE
 * Takes a raw row array (cols) and returns a clean product object
 */
function mapRowToProduct(cols) {
    return {
        id: clean(cols[col.id - 1]),
        name: clean(cols[col.name - 1]),
        category: clean(cols[col.category - 1]),
        subcategory: clean(cols[col.subcategory - 1]),
        material: clean(cols[col.material - 1]),
        des1: clean(cols[col.des1 - 1]),
        des2: clean(cols[col.des2 - 1]),
        attr1: clean(cols[col.attr1 - 1]),
        attr2: clean(cols[col.attr2 - 1]),
        attr3: clean(cols[col.attr3 - 1]),
        unit: clean(cols[col.unit - 1]),
        sale: clean(cols[col.sale - 1]) || "0",
        mrp: clean(cols[col.mrp - 1]) || "0",
        left: clean(cols[col.left - 1]),
        img1: clean(cols[col.img1 - 1]),
        img2: clean(cols[col.img2 - 1]),
        img3: clean(cols[col.img3 - 1]),
        img4: clean(cols[col.img4 - 1]),
        vid: clean(cols[col.vid - 1]),
        minOrder: clean(cols[col.minOrder - 1]),
        isKit: clean(cols[col.isKit - 1]).toLowerCase() === 'true',
        kitName: clean(cols[col.kitName - 1]),
        kitComponents: clean(cols[col.kitComponents - 1]),
        tagweb: clean(cols[col.tagweb - 1]),
        // Helper property calculated on the fly
        hasOptions: !!(clean(cols[col.attr1 - 1]) || clean(cols[col.attr2 - 1]) || clean(cols[col.attr3 - 1]))
    };
}


// container and card and sections are from below

// --- 3. DATA LOADING ---
// --- 3. DATA LOADING ---
async function loadProducts() {


    // stote cache file for fast work
    const CACHE_KEY = 'UTTAM_HUB_PRODUCTS';
    const CACHE_TIME_KEY = 'UTTAM_HUB_TIMESTAMP';
    const EXPIRE_TIME = 10 * 60 * 1000; // 10 minutes (Adjust as needed)


    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        // 1. Check if we have valid cache
        if (cachedData && cachedTime && (now - cachedTime < EXPIRE_TIME)) {
            console.log("⚡ Loading from Cache (Instant)");
            allProducts = JSON.parse(cachedData);
            
            // Trigger initial view
            const allBtn = document.querySelector('.cat-btn'); 
            filterView('all', allBtn);
            return; // Stop here, no need to fetch from internet
        }

        // 2. If no cache or expired, fetch from Google Sheets
        console.log("🌐 Fetching fresh data from Google Sheets...")
        const response = await fetch(CSV_URL);
        const data = await response.text();
        // Split by lines and remove empty ones
        const rows = data.split(/\r?\n/).filter(row => row.trim() !== "");

        allProducts = []; // Clear memory

        // Step A: Fill the memory bank first
        rows.slice(1).forEach(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (cols.length > 1) {
                const p = mapRowToProduct(cols);
                allProducts.push(p);
            }
        });

        // 3. Save the new data to Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(allProducts));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());

        // Step B: Now that data is ready, trigger the initial "All" view
        const allBtn = document.querySelector('.cat-btn'); 
        filterView('all', allBtn);

    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}


//let selectedAttrs = {}; // Stores user selection for the popup




// --- 4. CATEGORY FILTER & CARD RENDERING ---
function filterView(categoryTag, btn) {
    if (btn) {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    const container = document.getElementById('product-grid');
    if (!container) return;
    container.innerHTML = ""; 

    let filtered = (categoryTag === 'all') ? allProducts : 
        allProducts.filter(p => p.tagweb.toLowerCase().includes(categoryTag.toLowerCase()));

    // GROUP BY ID: One card per unique ID
    const grouped = filtered.reduce((acc, p) => {
        if (!acc[p.id]) acc[p.id] = [];
        acc[p.id].push(p);
        return acc;
    }, {});

    Object.values(grouped).forEach(variants => {
    const initial = variants[0];
        const hasVariants = variants.length > 1;
        const isKit = variants.some(v => v.isKit);

        // Show the default attributes on the card immediately
        const defaultText = [initial.attr1, initial.attr2, initial.attr3].filter(v => v).join(' / ');
        const defaultSpecs = hasVariants ? 
            `<div class="variant-specs" id="specs-${initial.id}">
                Default: ${defaultText}
            </div>` : "";

        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${initial.id}`; 

        let buttonsHtml = "";
        if (isKit) buttonsHtml += `<button class="btn-kit" onclick="openKitModal('${initial.id}')">Buy Kit</button>`;
        if (hasVariants) {
            buttonsHtml += `<button class="btn-cart" style="background:#2d3436" onclick="openVariantSheet('${initial.id}')">Choose Options</button>`;
        } else {
            buttonsHtml += `<button class="btn-cart" onclick="addToCart('${initial.id}')">Add to Cart</button>`;
        }

        card.innerHTML = `
            <img src="${initial.img1}" alt="${initial.name}" loading="lazy">
            <div class="card-content">
                <span class="category">${initial.category}</span> 
                <h3>${initial.name}</h3>
                ${defaultSpecs}
                <div class="price-row">
                    <span class="sell-price" id="price-${initial.id}">₹${initial.sale}</span>
                    <span class="mrp" id="mrp-${initial.id}">₹${initial.mrp}</span>
                </div>
                <div class="card-buttons">${buttonsHtml}</div>
            </div>
        `;
        container.appendChild(card);
});
}

// --- VARIANT POPUP LOGIC ---
function openVariantSheet(productId) {
    const variants = allProducts.filter(p => p.id === productId);
    selectedAttrs = {}; 
    const sheet = document.getElementById('variant-bottom-sheet');
    document.getElementById('sheet-product-name').innerText = variants[0].name;
    
    renderSheetControls(variants);
    sheet.classList.add('open');
    document.getElementById('variant-sheet-overlay').classList.add('open');
    updateSheetUI(variants);
}

function renderSheetControls(variants) {
    const content = document.getElementById('sheet-content');
    content.innerHTML = "";
    const keys = ['attr1', 'attr2', 'attr3'];
    const labels = ['Size', 'Width', 'Shape'];

    keys.forEach((key, i) => {
        const values = [...new Set(variants.map(v => v[key]))].filter(v => v !== "");
        if (values.length === 0) return;

        const group = document.createElement('div');
        group.className = 'attr-group';
        group.innerHTML = `<small>${labels[i]}:</small><div class="btn-group-variants" id="group-${key}"></div>`;
        content.appendChild(group);

        values.forEach(val => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.innerText = val;
            btn.onclick = () => { selectedAttrs[key] = (selectedAttrs[key] === val) ? null : val; updateSheetUI(variants); };
            btn.dataset.key = key;
            btn.dataset.val = val;
            group.querySelector('.btn-group-variants').appendChild(btn);
        });
    });
}

// --- UPDATED VARIANT UI LOGIC ---
function updateSheetUI(variants) {
    const keys = ['attr1', 'attr2', 'attr3'];
    const productId = variants[0].id;
    
    // 1. Handle Button Highlighting & Availability
    document.querySelectorAll('.opt-btn').forEach(btn => {
        const key = btn.dataset.key;
        const val = btn.dataset.val;
        btn.classList.toggle('active', selectedAttrs[key] === val);
        
        const tempSelection = {...selectedAttrs};
        delete tempSelection[key];
        const possible = variants.some(v => v[key] === val && Object.entries(tempSelection).every(([k, vVal]) => !vVal || v[k] === vVal));
        btn.disabled = !possible;
    });

    // 2. Find Best Match
    const match = variants.find(v => keys.every(k => !selectedAttrs[k] || v[k] === selectedAttrs[k]));
    const addBtn = document.getElementById('sheet-add-btn');

    if (match) {
        // Update Popup Price
        document.getElementById('sheet-price').innerText = `₹${match.sale}`;
        
        // LIVE SYNC WITH THE CARD IN BACKGROUND
        const cardPrice = document.getElementById(`price-${productId}`);
        const cardMrp = document.getElementById(`mrp-${productId}`);
        const cardSpecs = document.getElementById(`specs-${productId}`);
        
        if (cardPrice) cardPrice.innerText = `₹${match.sale}`;
        if (cardMrp) cardMrp.innerText = `₹${match.mrp}`;
        if (cardSpecs) {
            const currentStr = [match.attr1, match.attr2, match.attr3].filter(v => v).join(' / ');
            cardSpecs.innerHTML = `Selected: <strong>${currentStr}</strong>`;
            cardSpecs.style.borderColor = "var(--accent)"; // Change color to show activity
            cardSpecs.style.color = "#2d3436";
        }
    }

    // 3. Handle Add to Cart Button State
    const allPicked = keys.every(k => !variants.some(v => v[k] !== "") || selectedAttrs[k]);
    if (allPicked && match) {
        addBtn.disabled = false;
        addBtn.innerText = "Confirm Selection";
        addBtn.onclick = () => { addToCart(match.id, match); closeVariantSheet(); };
    } else {
        addBtn.disabled = true;
        addBtn.innerText = "Select All Options";
    }
}

function closeVariantSheet() {
    document.getElementById('variant-bottom-sheet').classList.remove('open');
    document.getElementById('variant-sheet-overlay').classList.remove('open');
}

// Update addToCart to handle variants
function addToCart(id, specificProduct = null) {
    const product = specificProduct || allProducts.find(p => String(p.id) === String(id));
    // Unique ID based on attributes to separate variants in cart
    const uniqueId = `${product.id}_${product.attr1}_${product.attr2}_${product.attr3}`;
    
    const existing = cart.find(item => item.uniqueId === uniqueId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ 
            uniqueId, id: product.id, name: product.name,
            variant: [product.attr1, product.attr2, product.attr3].filter(v => v).join(' / '),
            image: product.img1, sellPrice: Number(product.sale), quantity: 1 
        });
    }
    saveCart();
}


// --- 5. CART CORE LOGIC ---
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}

function saveCart() {
    localStorage.setItem('SHOP_CART', JSON.stringify(cart));
    renderCartUI();
    animateCartAction();
}

// --- UPDATED CART CORE LOGIC ---
// REMOVE the second addToCart(id) function from your file and use this single one:
function addToCart(id, specificProduct = null) {
    // If no specificProduct is passed, find the first one (for non-variant items)
    const product = specificProduct || allProducts.find(p => String(p.id) === String(id));
    if (!product) return;

    // Create a unique ID for the cart to distinguish variants
    const uniqueId = `${product.id}_${product.attr1}_${product.attr2}_${product.attr3}`;
    
    const existing = cart.find(item => item.uniqueId === uniqueId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ 
            uniqueId: uniqueId,
            id: product.id, 
            name: product.name,
            variant: [product.attr1, product.attr2, product.attr3].filter(v => v).join(' / '),
            image: product.img1, 
            sellPrice: Number(product.sale) || 0, 
            quantity: 1 
        });
    }
    saveCart();
}





function addKitToCart(id) {
    const product = allProducts.find(p => String(p.id) === String(id));
    if (!product || !product.kitComponents) return;

    const componentIDs = product.kitComponents.split(',').map(cid => cid.trim());
    const components = allProducts.filter(p => componentIDs.includes(String(p.id)));
    
    // Use Number(item.sale) to match your mapping
    let kitTotal = components.reduce((sum, item) => sum + (Number(item.sale) || 0), 0);
    
    const kitBundleId = `kit_${id}`; 
    const existingKit = cart.find(item => item.id === kitBundleId);

    if (existingKit) {
        existingKit.quantity += 1;
    } else {
        cart.push({
            id: kitBundleId,
            name: `${product.kitName || product.name} Bundle`,
            image: product.img1, // Use img1
            sellPrice: kitTotal, 
            quantity: 1
        });
    }
    saveCart();
}




function updateQuantity(uniqueId, change) {
    const item = cart.find(p => p.uniqueId === uniqueId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(p => p.uniqueId !== uniqueId);
        }
        saveCart();
    }
}

function clearCart() {
    if(confirm("Clear your cart?")) {
        cart = [];
        saveCart();
    }
}

// --- 6. UI RENDERING ---
function renderCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-amount');
    const countBadge = document.getElementById('cart-count');

    if (!container || !totalDisplay || !countBadge) return;

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    countBadge.innerText = totalQty;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Cart is empty</p>';
        totalDisplay.innerText = "0";
        return;
    }

    let grandTotal = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = (Number(item.sellPrice) || 0) * item.quantity;
        grandTotal += itemTotal;
        return `
            <div class="cart-row">
                <img src="${item.image}" alt="">
                <div class="cart-item-info">
                    <p style="margin:0; font-weight:600; font-size:14px;">${item.name}</p>
                    <small style="color:#777">${item.variant || ''}</small>
                    <div class="qty-controls" style="margin-top:5px;">
                        <button onclick="updateQuantity('${item.uniqueId}', -1)">-</button>
                        <span style="margin:0 10px;">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.uniqueId}', 1)">+</button>
                    </div>
                </div>
                <div style="font-weight:bold; color:#27ae60;">₹${itemTotal.toLocaleString('en-IN')}</div>
            </div>
        `;
    }).join('');
    totalDisplay.innerText = grandTotal.toLocaleString('en-IN');
}

// --- 7. KIT MODAL ---
function openKitModal(productId) {
    const product = allProducts.find(p => String(p.id) === String(productId));
    if (!product) return;

    const modal = document.getElementById('kit-modal');
    const kitContent = document.getElementById('kit-items-list');
    const footerLogic = document.getElementById('modal-footer-logic');
    
    const componentIDs = product.kitComponents.split(',').map(id => id.trim());
    const components = allProducts.filter(p => componentIDs.includes(String(p.id)));

    let totalMRP = 0;
    let totalSell = 0;

    kitContent.innerHTML = components.map((item) => {
        totalMRP += Number(item.mrp) || 0;
        totalSell += Number(item.sale) || 0;
        return `
            <div class="kit-item">
                <img src="${item.image}" class="kit-item-img">
                <div class="kit-item-details">
                    <div class="kit-item-name">${item.name}</div>
                    <div class="kit-item-price">
                        <span class="sell">₹${item.sale}</span>
                        <span class="mrp">₹${item.mrp}</span>
                    </div>
                </div>
            </div>`;
    }).join('');

    footerLogic.innerHTML = `
        <div class="kit-total-display">
            <p>Total Bundle MRP: <span class="mrp-total">₹${totalMRP}</span></p>
            <p class="final-price">Kit Price: ₹${totalSell}</p>
        </div>
        <button class="btn-buy-bundle" onclick="addKitToCart('${product.id}'); closeModal();">
            ADD FULL BUNDLE TO CART
        </button>
    `;
    modal.style.display = 'flex';
}



function closeModal() { document.getElementById('kit-modal').style.display = 'none'; }

// --- 8. ANIMATION & CHECKOUT ---
function animateCartAction() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    badge.classList.remove('cart-bounce');
    void badge.offsetWidth; 
    badge.classList.add('cart-bounce');
}

// Update WhatsApp message to include variant info
function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let message = "*📦 NEW ORDER - UTTAM HUB*%0A--------------------------%0A";
    cart.forEach((item, index) => {
        message += `*${index + 1}. ${item.name}* ${item.variant ? '('+item.variant+')' : ''}%0A`;
        message += `Qty: ${item.quantity} | Price: ₹${(item.sellPrice * item.quantity).toLocaleString('en-IN')}%0A%0A`;
    });

    const total = document.getElementById('cart-total-amount').innerText;
    message += `*TOTAL PAYABLE: ₹${total}*%0A--------------------------%0APlease confirm my order.`;

    window.open(`https://wa.me/919724362981?text=${message}`, '_blank');
}



// cart div genaret everywhere
// with using place this into html file <div id="cart-placeholder"></div> 
//where you want cart
async function injectGlobalCart() {
    const placeholder = document.getElementById('cart-placeholder');
    if (!placeholder) return;

    // 1. Get the current depth of the file
    // index.html = 0 or 1
    // /divisions/gift art.html = 2
    // /divisions/css/rate.html = 3
    const pathSegments = window.location.pathname.split('/').filter(p => p).length;
    
    let prefix = "";
    if (pathSegments > 1) {
        // Adds "../" for every level deeper than root
        prefix = "../".repeat(pathSegments - 1);
    }

    try {
        // Fetch the component from the root using the prefix
        const response = await fetch(prefix + 'cart-component.html');
        const html = await response.text();
        placeholder.innerHTML = html;
        
        // Sync the cart data immediately
        renderCartUI(); 
    } catch (err) {
        console.error("Cart injection failed. Check if cart-component.html is in root.", err);
    }
}




// Modify your existing DOMContentLoaded listener:
document.addEventListener('DOMContentLoaded', () => {
    // This loads the HTML AND then calls renderCartUI() automatically
    injectGlobalCart();

    // Load products only if a grid exists on the page
    if (document.getElementById('product-grid')) {
        loadProducts();
    }
});

