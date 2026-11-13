/**
 * 369° PASSION — LUXURY COLLECTIBLES & HOBBY STOREFRONT (VERSION 2)
 * High-Credibility Prototype:
 * - Persistent Cart (localStorage) & Per-item Stock Limits (e.g. 1-off Singles)
 * - Safe Form Validation & Real-time Sanitized Preview
 * - Inline Non-blocking Enquiries & Marketplace Listing Highlights
 * - Dynamic Free Penang Pickup vs RM 12 Tracked Courier calculations
 */

// --- Persistence Key ---
const STORAGE_KEY = '369_passion_cart_v2';

// --- Application State ---
const STATE = {
  cart: loadCartFromStorage(),
  selectedFulfillment: 'pickup', // 'pickup' | 'delivery'
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  selectedProduct: null,
  activeEnquiryItem: null,
  orderCounter: 10420,
  lastOrder: null
};

// --- Shop Catalog Inventory (Curated Products with strict stock counts) ---
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Evolving Horizons Elite Booster Box',
    category: 'sealed',
    categoryLabel: 'Sealed Products',
    price: 680.00,
    badge: 'Flagship Box',
    badgeClass: 'gold',
    image: 'assets/shop-booster-box.webp',
    extraImages: ['assets/shop-booster-box.webp'],
    stock: 5,
    highlight: '36 Booster Packs • Factory Sealed Case',
    condition: 'Factory Sealed / Mint',
    language: 'English',
    contents: '36 Draft Booster Packs, 1 Foil Promo Box Topper, 1 Collector Card Guide',
    description: 'Factory sealed booster box direct from case distribution. Features authentic shrink wrap with embossed seal.'
  },
  {
    id: 'prod-2',
    name: 'Lunar Fox Celestial VMAX — Alt Art Secret',
    category: 'singles',
    categoryLabel: 'Single Cards',
    price: 1250.00,
    badge: '1 Available',
    badgeClass: 'gold',
    image: 'assets/shop-lunar-fox-single.webp',
    extraImages: ['assets/shop-lunar-fox-single.webp'],
    stock: 1, // STRICT 1 AVAILABLE
    highlight: 'Near Mint+ / PSA 10 Contender • 1 Available',
    condition: 'Near Mint+ / Unplayed (PSA 10 Contender)',
    language: 'Japanese',
    contents: '1x Textured Full Art Holo, Magnetic UV-Touch Case Included',
    description: 'Breathtaking textured foil depicting the Nine-Tailed Celestial Fox. Flawless centering, razor-sharp corners, zero print lines. One-of-a-kind piece from our private archive.'
  },
  {
    id: 'prod-3',
    name: 'Infernal Dragon Sovereign — Special Illustration Rare',
    category: 'singles',
    categoryLabel: 'Single Cards',
    price: 890.00,
    badge: 'Near Mint',
    badgeClass: '',
    image: 'assets/shop-dragon-single.webp',
    extraImages: ['assets/shop-dragon-single.webp'],
    stock: 2,
    highlight: 'Near Mint (Gradeable) • Double Sleeved',
    condition: 'Near Mint (Gradeable)',
    language: 'English',
    contents: '1x Textured Full-Art Ultra Rare, Double-Sleeved in KMC Perfect Fit',
    description: 'High-demand dragon sovereign alternate art foil. Crisp surface finish and razor-sharp borders.'
  },
  {
    id: 'prod-4',
    name: 'Crown Zenith Collector Foil Booster Pack',
    category: 'sealed',
    categoryLabel: 'Sealed Products',
    price: 45.00,
    badge: 'In Stock',
    badgeClass: '',
    image: 'assets/shop-booster-pack.webp',
    extraImages: ['assets/shop-booster-pack.webp'],
    stock: 24,
    highlight: '10 Foil Cards per Pack • Unweighed',
    condition: 'Factory Sealed (Unweighed)',
    language: 'English',
    contents: '10 Cards per Pack + 1 Basic Energy or VSTAR Marker',
    description: 'Individual unweighed booster packs sourced from sealed collection tins. Perfect for rip sessions at our café tables.'
  },
  {
    id: 'prod-5',
    name: 'Smoked Walnut & Velvet 9-Pocket Archival Binder',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 185.00,
    badge: 'Café Edition',
    badgeClass: '',
    image: 'assets/shop-velvet-binder.webp',
    extraImages: ['assets/shop-velvet-binder.webp'],
    stock: 8,
    highlight: 'Holds 360 Cards • Acid-Free Side Loading',
    condition: 'Brand New In Box',
    language: 'N/A',
    contents: '360 Card Capacity, Archival Acid-Free Side-Loading Pages, Brass Zipper',
    description: 'Crafted to pair with our café uniform aesthetic. Deep espresso vegan leather with plush velvet interior and heavy-duty brass zipper pull.'
  },
  {
    id: 'prod-6',
    name: 'Antique Brass Magnetic Card Touch Cases (Pack of 5)',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 65.00,
    badge: 'Essential',
    badgeClass: '',
    image: 'assets/shop-magnetic-holder.webp',
    extraImages: ['assets/shop-magnetic-holder.webp'],
    stock: 15,
    highlight: 'Pack of 5 • 35pt UV-Blocking Diamond Corners',
    condition: 'Brand New',
    language: 'N/A',
    contents: '5x 35pt UV-Blocking Magnetic One-Touch Holders with Diamond Corners',
    description: 'Laboratory tested UV protection to preserve foil vibrancy from sunlight and ambient spotlight glare.'
  },
  {
    id: 'prod-7',
    name: 'Heritage Espresso Leather Deck Vault 100+',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 120.00,
    badge: 'Signature',
    badgeClass: '',
    image: 'assets/shop-deck-box.webp',
    extraImages: ['assets/shop-deck-box.webp'],
    stock: 6,
    highlight: 'Holds 100+ Double-Sleeved Cards + Dice Tray',
    condition: 'Brand New',
    language: 'N/A',
    contents: 'Holds 100+ Double-Sleeved Cards + Removable Dice/Token Tray',
    description: 'Self-locking magnetic closure with embossed 369° monogram. Tested to withstand inverted drop tests.'
  },
  {
    id: 'prod-8',
    name: 'Matte Ivory Tournament Card Sleeves (100ct)',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 38.00,
    badge: 'Tournament',
    badgeClass: '',
    image: 'assets/shop-card-sleeves.webp',
    extraImages: ['assets/shop-card-sleeves.webp'],
    stock: 30,
    highlight: '100 Standard Size Sleeves • Matte Texture',
    condition: 'Brand New',
    language: 'N/A',
    contents: '100 Standard Size Matte Back Sleeves, Fully Opaque',
    description: 'Buttery shuffle feel designed for competitive TCG play. Matches our warm ivory table mats.'
  }
];

// --- Collector Marketplace Items (4 Curated Initial Listings) ---
let MARKETPLACE_LISTINGS = [
  {
    id: 'mkt-1',
    name: 'Charizard VMAX 1st Edition Rainbow — PSA 10 Gem Mint',
    category: 'Graded Cards',
    price: 3400.00,
    seller: 'Kenji Tan',
    condition: 'PSA 10 Gem Mint (Cert #6849201)',
    handover: 'In-person inspection or Tracked Courier',
    image: 'assets/marketplace-slab.webp',
    notes: 'Kept in darkness and dehumidified dry cabinet. Looking for serious collectors or direct transfer.'
  },
  {
    id: 'mkt-2',
    name: '1999 Base Set Shadowless Blastoise Holo #2/102',
    category: 'Single Cards',
    price: 1850.00,
    seller: 'Marcus L.',
    condition: 'Excellent / Light Play (Clean Foil)',
    handover: 'Penang Island Meetup Preferred',
    image: 'assets/marketplace-vintage-card.webp',
    notes: 'Authentic childhood collection piece. Zero creases, minimal silvering along the top border.'
  },
  {
    id: 'mkt-3',
    name: 'Pop Mart Mega Space Molly 400% — Heritage Brown',
    category: 'Designer Toys',
    price: 980.00,
    seller: 'Chloe W.',
    condition: 'Display Only / With Original Outer Box & ID Card',
    handover: 'Store Handover at 369° Passion Counter',
    image: 'assets/marketplace-vinyl-toy.webp',
    notes: 'Collector piece displayed behind acrylic dust glass in pet-free studio.'
  },
  {
    id: 'mkt-4',
    name: 'Initial D AE86 Sprinter Trueno 1:18 Diecast Model',
    category: 'Scale Collectibles',
    price: 620.00,
    seller: 'Jason Ooi',
    condition: 'Mint In Box (Unopened Straps)',
    handover: 'Penang Hand Delivery / Bubble-wrapped Courier',
    image: 'assets/marketplace-model-car.webp',
    notes: 'Fully articulated pop-up headlights, openable doors, detailed 4A-GE engine bay.'
  }
];

// --- Utility Functions ---
function formatRM(amount) {
  return `RM ${Number(amount).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE.cart));
  } catch (e) {}
}

// --- Render Catalog ---
function renderCatalog() {
  const grid = document.getElementById('shop-product-grid');
  const countEl = document.getElementById('shop-results-count');
  if (!grid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchesCat = STATE.currentCategory === 'all' || p.category === STATE.currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(STATE.searchQuery.toLowerCase()) ||
                          p.categoryLabel.toLowerCase().includes(STATE.searchQuery.toLowerCase()) ||
                          p.highlight.toLowerCase().includes(STATE.searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (STATE.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (STATE.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-ink-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">No acquisitions found matching "${escapeHTML(STATE.searchQuery)}"</p>
        <button class="btn-secondary" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const cartItem = STATE.cart.find(item => item.id === product.id);
    const cartQty = cartItem ? cartItem.qty : 0;
    const isSoldOut = cartQty >= product.stock;
    const isSingleOneOff = product.stock === 1;

    return `
      <article class="product-card" onclick="openProductModal('${product.id}')">
        <div class="product-img-wrap ${product.id === 'prod-2' ? 'lunar-foil-wrap' : ''}">
          <img class="product-img" src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy">
          ${product.badge ? `<span class="product-badge ${product.badgeClass}">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${escapeHTML(product.name)}</h3>
          <div class="product-price">
            <small>RM</small>${product.price.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div class="product-highlight">${escapeHTML(product.highlight)}</div>
          
          <div class="product-footer">
            <span class="stock-indicator ${product.stock <= 2 ? 'low' : ''}">
              ${isSingleOneOff ? 'Only 1 in archive' : `${product.stock} in stock`}
            </span>
            <button class="btn-add-quick" ${isSoldOut ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="event.stopPropagation(); triggerAddWithFeedback(this, '${product.id}')">
              ${isSoldOut ? 'Cap Reached' : `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Add
              `}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// --- Render Marketplace Listings ---
function renderMarketplace() {
  const grid = document.getElementById('marketplace-grid');
  if (!grid) return;

  grid.innerHTML = MARKETPLACE_LISTINGS.map(item => `
    <article class="product-card ${item.isNew ? 'new-listing-highlight' : ''}" id="card-${item.id}" onclick="openCollectorModal('${item.id}')">
      <div class="product-img-wrap">
        <img class="product-img" src="${item.image}" alt="${escapeHTML(item.name)}" loading="lazy">
        <span class="product-badge">${escapeHTML(item.category)}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${escapeHTML(item.name)}</h3>
        <div class="product-price">
          <small>RM</small>${Number(item.price).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        
        <!-- Standardized 3 rows: Seller, Condition, Handover -->
        <div class="marketplace-standard-meta">
          <div class="mkt-meta-row"><strong>Seller:</strong> ${escapeHTML(item.seller)}</div>
          <div class="mkt-meta-row"><strong>Condition:</strong> ${escapeHTML(item.condition)}</div>
          <div class="mkt-meta-row"><strong>Handover:</strong> ${escapeHTML(item.handover)}</div>
        </div>

        <div class="product-footer">
          <span style="font-size: 0.76rem; color: var(--color-ink-muted);">Member Listing</span>
          <button class="btn-add-quick" style="background: var(--color-surface-oat);" onclick="event.stopPropagation(); openCollectorModal('${item.id}')">
            Enquire
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// --- Cart & Stock Management ---
function triggerAddWithFeedback(btn, productId) {
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `✓ Added`;
  btn.style.background = 'var(--color-heritage-teal)';
  btn.style.color = '#fff';
  
  addToBag(productId, 1);

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.style.color = '';
  }, 900);
}

function addToBag(productId, qty = 1) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const existing = STATE.cart.find(item => item.id === productId);
  const currentQty = existing ? existing.qty : 0;

  if (currentQty + qty > prod.stock) {
    alert(`Only ${prod.stock} unit(s) of "${prod.name}" available in the archive.`);
    return;
  }

  if (existing) {
    existing.qty += qty;
  } else {
    STATE.cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      stock: prod.stock,
      highlight: prod.highlight,
      qty: qty
    });
  }

  saveCartToStorage();
  updateBagUI();
  renderCatalog();
  openCartDrawer();
}

function updateBagQty(productId, delta) {
  const item = STATE.cart.find(i => i.id === productId);
  if (!item) return;

  const prod = PRODUCTS.find(p => p.id === productId);
  const maxStock = prod ? prod.stock : 99;

  if (delta > 0 && item.qty >= maxStock) {
    alert(`Maximum available stock reached (${maxStock} units).`);
    return;
  }

  item.qty += delta;
  if (item.qty <= 0) {
    STATE.cart = STATE.cart.filter(i => i.id !== productId);
  }

  saveCartToStorage();
  updateBagUI();
  renderCatalog();
}

function removeFromBag(productId) {
  STATE.cart = STATE.cart.filter(i => i.id !== productId);
  saveCartToStorage();
  updateBagUI();
  renderCatalog();
}

function getBagSubtotal() {
  return STATE.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateBagUI() {
  const countEl = document.getElementById('bag-count-badge');
  const totalCount = STATE.cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) {
    countEl.textContent = totalCount;
    countEl.style.display = totalCount > 0 ? 'inline-block' : 'none';
    // Animation bump
    countEl.classList.remove('count-bump');
    void countEl.offsetWidth; // trigger reflow
    countEl.classList.add('count-bump');
  }

  const itemsWrap = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal-val');

  if (itemsWrap) {
    if (STATE.cart.length === 0) {
      itemsWrap.innerHTML = `
        <div class="cart-empty-state">
          <svg style="margin: 0 auto 16px; color: var(--color-ink-muted);" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p style="font-weight: 600; margin-bottom: 4px;">Your Collector Bag is Empty</p>
          <p style="font-size: 0.84rem;">Explore our sealed boxes, rare singles, and café accessories.</p>
        </div>
      `;
    } else {
      itemsWrap.innerHTML = STATE.cart.map(item => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.image}" alt="${escapeHTML(item.name)}">
          <div style="flex: 1;">
            <h4 class="cart-item-name">${escapeHTML(item.name)}</h4>
            <div class="cart-item-meta">${escapeHTML(item.highlight || '')}</div>
            <div class="cart-item-price">${formatRM(item.price)}</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="updateBagQty('${item.id}', -1)">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" ${item.qty >= item.stock ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} onclick="updateBagQty('${item.id}', 1)">+</button>
            </div>
            ${item.stock === 1 ? `<div style="font-size: 0.7rem; color: var(--color-antique-brass); margin-top: 3px;">Archive limit: 1 piece</div>` : ''}
          </div>
          <button class="icon-btn" style="padding: 4px;" onclick="removeFromBag('${item.id}')" title="Remove">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      `).join('');
    }
  }

  if (subtotalEl) {
    subtotalEl.textContent = formatRM(getBagSubtotal());
  }

  updateCheckoutSummary();
}

function openCartDrawer() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-backdrop').classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-backdrop').classList.remove('open');
}

// --- Product Modal Detail ---
function openProductModal(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  STATE.selectedProduct = prod;
  const inCart = STATE.cart.find(i => i.id === prod.id);
  const currentCartQty = inCart ? inCart.qty : 0;
  const isCapReached = currentCartQty >= prod.stock;

  const content = document.getElementById('product-modal-content');
  content.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" onclick="closeProductModal()" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      
      <div class="modal-gallery">
        <div class="modal-img-container ${prod.id === 'prod-2' ? 'lunar-foil-wrap' : ''}">
          <img class="modal-hero-img" id="modal-main-image" src="${prod.image}" alt="${escapeHTML(prod.name)}">
        </div>
        ${prod.stock === 1 ? `<div class="single-card-banner">Archive Exclusive • Single Item</div>` : ''}
      </div>

      <div class="modal-details">
        <span class="product-category">${escapeHTML(prod.categoryLabel)}</span>
        <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.85rem; font-weight: 600; line-height: 1.2; margin-bottom: 8px;">${escapeHTML(prod.name)}</h2>
        <div style="font-size: 1.45rem; font-weight: 700; color: var(--color-ink-espresso); margin-bottom: 12px;">
          ${formatRM(prod.price)}
        </div>

        <p style="font-size: 0.92rem; color: var(--color-ink-muted); line-height: 1.55; margin-bottom: 12px;">
          ${escapeHTML(prod.description)}
        </p>

        <div class="spec-grid">
          <div class="spec-item">
            <span class="spec-label">Condition:</span>
            <span class="spec-val">${escapeHTML(prod.condition)}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Language:</span>
            <span class="spec-val">${escapeHTML(prod.language)}</span>
          </div>
          <div class="spec-item" style="grid-column: 1 / -1;">
            <span class="spec-label">Key Specifications:</span>
            <span class="spec-val">${escapeHTML(prod.contents)}</span>
          </div>
        </div>

        <div style="margin-top: auto; padding-top: 16px; border-top: var(--border-fine);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.85rem;">
            <span style="color: var(--color-ink-muted);">Archive Availability:</span>
            <strong>${prod.stock === 1 ? '1 Piece Only' : `${prod.stock} Available`}</strong>
          </div>
          <button class="btn-primary" style="width: 100%;" ${isCapReached ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="addToBag('${prod.id}'); closeProductModal();">
            ${isCapReached ? 'Maximum Stock in Bag' : 'Add to Collector Bag'}
          </button>
        </div>

        <div style="font-size: 0.78rem; color: var(--color-ink-muted); display: flex; align-items: center; gap: 6px; margin-top: 10px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Available for Penang store pickup or courier delivery.
        </div>
      </div>
    </div>
  `;

  document.getElementById('product-modal-backdrop').classList.add('open');
}

function closeProductModal() {
  document.getElementById('product-modal-backdrop').classList.remove('open');
}

// --- Marketplace Collector Modal & Non-Blocking Inline Enquiry ---
function openCollectorModal(itemId) {
  const item = MARKETPLACE_LISTINGS.find(m => m.id === itemId);
  if (!item) return;

  STATE.activeEnquiryItem = item;

  const content = document.getElementById('product-modal-content');
  content.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" onclick="closeProductModal()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      
      <div class="modal-gallery">
        <img class="modal-hero-img" src="${item.image}" alt="${escapeHTML(item.name)}">
      </div>

      <div class="modal-details">
        <span class="product-category" style="color: var(--color-heritage-teal);">Collector Peer Listing</span>
        <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.85rem; font-weight: 600; line-height: 1.2; margin-bottom: 8px;">${escapeHTML(item.name)}</h2>
        <div style="font-size: 1.45rem; font-weight: 700; color: var(--color-ink-espresso); margin-bottom: 12px;">
          ${formatRM(item.price)}
        </div>

        <div class="marketplace-standard-meta" style="margin-bottom: 14px;">
          <div class="mkt-meta-row"><strong>Listed by:</strong> ${escapeHTML(item.seller)}</div>
          <div class="mkt-meta-row"><strong>Condition:</strong> ${escapeHTML(item.condition)}</div>
          <div class="mkt-meta-row"><strong>Handover:</strong> ${escapeHTML(item.handover)}</div>
        </div>

        <p style="font-size: 0.92rem; color: var(--color-ink-muted); line-height: 1.55; margin-bottom: 12px;">
          ${escapeHTML(item.notes)}
        </p>

        <div id="enquiry-zone" style="margin-top: auto; padding-top: 14px; border-top: var(--border-fine);">
          <button class="btn-primary" style="width: 100%;" onclick="showInlineEnquiryForm()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Contact Seller (${escapeHTML(item.seller.split(' ')[0])})
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('product-modal-backdrop').classList.add('open');
}

function showInlineEnquiryForm() {
  const item = STATE.activeEnquiryItem;
  if (!item) return;

  const zone = document.getElementById('enquiry-zone');
  if (!zone) return;

  zone.innerHTML = `
    <div class="inline-enquiry-card">
      <h4 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 6px;">Enquire with ${escapeHTML(item.seller)}</h4>
      <p style="font-size: 0.8rem; color: var(--color-ink-muted); margin-bottom: 10px;">
        Regarding: <strong>${escapeHTML(item.name)}</strong> (${formatRM(item.price)})
      </p>
      
      <div class="form-group" style="margin-bottom: 8px;">
        <label class="form-label" style="font-size: 0.75rem;">Your Message / Meetup Proposal</label>
        <textarea class="form-textarea" id="enquiry-msg" rows="2" style="font-size: 0.82rem;">Hi ${escapeHTML(item.seller.split(' ')[0])}, I'm interested in inspecting this item at the 369° Passion café table. Is it still available?</textarea>
      </div>

      <div style="display: flex; gap: 8px;">
        <button class="btn-primary" style="flex: 1; padding: 10px; font-size: 0.85rem;" onclick="submitInlineEnquiry()">
          Send Enquiry Preview
        </button>
        <button class="btn-secondary" style="padding: 10px 14px; font-size: 0.85rem;" onclick="openCollectorModal('${item.id}')">
          Cancel
        </button>
      </div>
    </div>
  `;
}

function submitInlineEnquiry() {
  const zone = document.getElementById('enquiry-zone');
  const item = STATE.activeEnquiryItem;
  if (!zone || !item) return;

  // Non-blocking inline feedback banner
  zone.innerHTML = `
    <div class="enquiry-success-banner">
      <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--color-heritage-teal); margin-bottom: 4px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Enquiry Preview Sent
      </div>
      <p style="font-size: 0.82rem; color: var(--color-ink-walnut); line-height: 1.45;">
        In the live marketplace, ${escapeHTML(item.seller)} receives your inquiry immediately via WhatsApp / collector notification with escrow meetup details.
      </p>
      <button class="btn-secondary" style="margin-top: 10px; padding: 6px 14px; font-size: 0.8rem;" onclick="closeProductModal()">
        Done
      </button>
    </div>
  `;
}

// --- List an Item Modal & Real-time Sanitized Preview ---
function openListItemModal() {
  const content = document.getElementById('product-modal-content');
  content.innerHTML = `
    <div class="modal-dialog" style="grid-template-columns: 1.15fr 1fr; max-width: 960px;">
      <button class="modal-close-btn" onclick="closeProductModal()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div style="padding: var(--space-xl); overflow-y: auto;">
        <span class="section-eyebrow">Collector Marketplace</span>
        <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.8rem; font-weight: 600; margin-bottom: 6px;">List a Collectible</h2>
        <p style="font-size: 0.85rem; color: var(--color-ink-muted); margin-bottom: var(--space-md);">
          Add an item to the community marketplace. Live preview updates as you type.
        </p>

        <form id="listing-form" onsubmit="event.preventDefault(); publishCollectorListing();">
          <div class="form-group">
            <label class="form-label" for="list-title">Item Title <span style="color: #b00;">*</span></label>
            <input type="text" class="form-input" id="list-title" required placeholder="e.g. Vintage Holo Card / Graded Slab" value="Pop Mart Skullpanda Winter Series Rare" oninput="updateLivePreview()">
            <div id="title-error" class="form-field-error"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label" for="list-cat">Category <span style="color: #b00;">*</span></label>
              <select class="form-select" id="list-cat" onchange="updateLivePreview()">
                <option value="Single Cards">Single Cards</option>
                <option value="Graded Cards">Graded Cards</option>
                <option value="Sealed Products">Sealed Products</option>
                <option value="Designer Toys" selected>Designer Toys</option>
                <option value="Scale Collectibles">Scale Collectibles</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="list-price">Price in RM <span style="color: #b00;">*</span></label>
              <input type="number" step="0.50" min="1" class="form-input" id="list-price" required placeholder="0.00" value="480.00" oninput="updateLivePreview()">
              <div id="price-error" class="form-field-error"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="list-cond">Condition</label>
            <select class="form-select" id="list-cond" onchange="updateLivePreview()">
              <option value="Mint In Box / Never Displayed">Mint In Box / Never Displayed</option>
              <option value="Near Mint (NM) / Gradeable">Near Mint (NM) / Gradeable</option>
              <option value="Lightly Played (LP)">Lightly Played (LP)</option>
              <option value="PSA 10 Gem Mint">PSA 10 Gem Mint</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="list-handover">Handover Preference <span style="color: #b00;">*</span></label>
            <select class="form-select" id="list-handover" onchange="updateLivePreview()">
              <option value="Penang Store Meetup">Penang Store Meetup</option>
              <option value="Tracked Courier Delivery">Tracked Courier Delivery</option>
              <option value="Store Meetup or Tracked Courier" selected>Store Meetup or Tracked Courier</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Item Photo</label>
            <div class="upload-dropzone" onclick="document.getElementById('list-file-input').click()">
              <svg style="margin: 0 auto 6px; color: var(--color-antique-brass);" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <div style="font-size: 0.82rem; font-weight: 600;">Choose local photo or drop here</div>
              <div style="font-size: 0.72rem; color: var(--color-ink-muted);">PNG, JPG, WEBP (Instant preview)</div>
              <input type="file" id="list-file-input" style="display: none;" accept="image/*" onchange="handleFileUpload(event)">
            </div>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;">
            Add Demo Listing
          </button>
        </form>
      </div>

      <!-- Real-time Preview Pane -->
      <div style="background: var(--color-surface-oat); padding: var(--space-xl); display: flex; flex-direction: column; justify-content: center; border-left: var(--border-fine);">
        <span style="font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-antique-brass); font-weight: 600; margin-bottom: 12px; display: block;">
          Live Card Preview
        </span>
        
        <article class="product-card" style="box-shadow: var(--shadow-elevated); background: #FAF6EF;">
          <div class="product-img-wrap">
            <img class="product-img" id="preview-img" src="assets/marketplace-vinyl-toy.webp" alt="Preview">
            <span class="product-badge" id="preview-cat">Designer Toys</span>
          </div>
          <div class="product-info">
            <h3 class="product-name" id="preview-title">Pop Mart Skullpanda Winter Series Rare</h3>
            <div class="product-price" id="preview-price">
              <small>RM</small>480.00
            </div>
            
            <div class="marketplace-standard-meta">
              <div class="mkt-meta-row"><strong>Seller:</strong> You (Sample Collector)</div>
              <div class="mkt-meta-row"><strong>Condition:</strong> <span id="preview-cond">Mint In Box / Never Displayed</span></div>
              <div class="mkt-meta-row"><strong>Handover:</strong> <span id="preview-handover">Store Meetup or Tracked Courier</span></div>
            </div>

            <div class="product-footer">
              <span style="font-size: 0.76rem; color: var(--color-ink-muted);">Just Added</span>
              <button class="btn-add-quick" style="background: var(--color-surface-oat);">
                Enquire
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  `;

  document.getElementById('product-modal-backdrop').classList.add('open');
  updateLivePreview();
}

function updateLivePreview() {
  const rawTitle = document.getElementById('list-title')?.value.trim() || 'Untitled Collectible';
  const rawPrice = parseFloat(document.getElementById('list-price')?.value);
  const rawCat = document.getElementById('list-cat')?.value || 'Collectible';
  const rawCond = document.getElementById('list-cond')?.value || 'Mint';
  const rawHandover = document.getElementById('list-handover')?.value || 'Store Meetup';

  const previewTitle = document.getElementById('preview-title');
  const previewPrice = document.getElementById('preview-price');
  const previewCat = document.getElementById('preview-cat');
  const previewCond = document.getElementById('preview-cond');
  const previewHandover = document.getElementById('preview-handover');

  if (previewTitle) previewTitle.textContent = rawTitle;
  if (previewCat) previewCat.textContent = rawCat;
  if (previewCond) previewCond.textContent = rawCond;
  if (previewHandover) previewHandover.textContent = rawHandover;

  if (previewPrice) {
    if (!isNaN(rawPrice) && rawPrice > 0) {
      previewPrice.innerHTML = `<small>RM</small>${rawPrice.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      previewPrice.innerHTML = `<small>RM</small>0.00`;
    }
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const previewImg = document.getElementById('preview-img');
    if (previewImg) {
      previewImg.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

function publishCollectorListing() {
  const titleInput = document.getElementById('list-title');
  const priceInput = document.getElementById('list-price');
  const catInput = document.getElementById('list-cat');
  const condInput = document.getElementById('list-cond');
  const handoverInput = document.getElementById('list-handover');
  const previewImg = document.getElementById('preview-img')?.src || 'assets/marketplace-vinyl-toy.webp';

  const title = titleInput?.value.trim();
  const price = parseFloat(priceInput?.value);

  // Validate strictly without silent fallback
  if (!title) {
    alert('Please provide an item title.');
    titleInput.focus();
    return;
  }
  if (isNaN(price) || price <= 0) {
    alert('Please enter a valid price in RM greater than zero.');
    priceInput.focus();
    return;
  }

  const newListing = {
    id: `mkt-${Date.now()}`,
    name: title,
    category: catInput.value,
    price: price,
    seller: 'You (Collector)',
    condition: condInput.value,
    handover: handoverInput.value,
    image: previewImg,
    notes: 'Freshly listed by collector via 369° Passion portal.',
    isNew: true
  };

  // Prepend to marketplace
  MARKETPLACE_LISTINGS.unshift(newListing);
  renderMarketplace();
  closeProductModal();

  // Show inline non-blocking confirmation banner above marketplace
  showMarketplaceBanner(`✓ Demo listing "${escapeHTML(title)}" added to the top of the marketplace!`);
  navigateTo('marketplace-section');

  // Highlight effect
  setTimeout(() => {
    const el = document.getElementById(`card-${newListing.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 300);
}

function showMarketplaceBanner(msg) {
  const banner = document.getElementById('marketplace-feedback-banner');
  if (!banner) return;
  banner.innerHTML = `
    <div class="feedback-toast">
      <span>${msg}</span>
      <button class="toast-close-btn" onclick="this.parentElement.remove()">×</button>
    </div>
  `;
}

// --- Checkout Flow ---
function proceedToCheckout() {
  if (STATE.cart.length === 0) {
    alert('Please add at least one item to your collector bag first.');
    return;
  }
  closeCartDrawer();
  
  document.getElementById('main-storefront-view').style.display = 'none';
  const checkoutView = document.getElementById('checkout-view');
  checkoutView.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateCheckoutSummary();
}

function returnToStore() {
  document.getElementById('checkout-view').classList.remove('active');
  document.getElementById('confirmation-view').style.display = 'none';
  document.getElementById('main-storefront-view').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setFulfillment(type) {
  STATE.selectedFulfillment = type;
  document.querySelectorAll('.fulfillment-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.fulfillment === type);
  });
  
  const radio = document.querySelector(`input[name="fulfillment"][value="${type}"]`);
  if (radio) radio.checked = true;

  const instructionsEl = document.getElementById('fulfillment-instructions');
  if (instructionsEl) {
    if (type === 'pickup') {
      instructionsEl.innerHTML = `
        <div class="fulfillment-notice-box">
          <strong>Example Penang In-Store Collection:</strong><br>
          Penang Store Concept • Order inspected, sleeved, and prepared at our café counter.
        </div>
      `;
    } else {
      instructionsEl.innerHTML = `
        <div class="fulfillment-notice-box" style="border-left-color: var(--color-heritage-teal);">
          <strong>Tracked Courier Delivery across Malaysia (+RM 12.00):</strong><br>
          Reinforced rigid card armor packing, bubble-wrapped, tracked doorstep courier.
        </div>
      `;
    }
  }

  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const summaryContainer = document.getElementById('checkout-items-summary');
  if (!summaryContainer) return;

  summaryContainer.innerHTML = STATE.cart.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.88rem;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${item.image}" style="width: 44px; height: 44px; object-fit: contain; background: var(--color-surface-oat); border-radius: var(--radius-xs); padding: 2px;">
        <div>
          <div style="font-weight: 600;">${escapeHTML(item.name)}</div>
          <div style="font-size: 0.78rem; color: var(--color-ink-muted);">Qty: ${item.qty}</div>
        </div>
      </div>
      <div style="font-weight: 700;">${formatRM(item.price * item.qty)}</div>
    </div>
  `).join('');

  const subtotal = getBagSubtotal();
  const shippingFee = STATE.selectedFulfillment === 'delivery' ? 12.00 : 0.00;
  const total = subtotal + shippingFee;

  document.getElementById('checkout-subtotal').textContent = formatRM(subtotal);
  document.getElementById('checkout-shipping').textContent = shippingFee === 0 ? 'FREE (Store Pickup)' : 'RM 12.00';
  document.getElementById('checkout-total').textContent = formatRM(total);
}

function executeDemoCheckout() {
  const orderNum = `369-DEMO-${STATE.orderCounter++}`;
  const total = getBagSubtotal() + (STATE.selectedFulfillment === 'delivery' ? 12.00 : 0.00);
  
  STATE.lastOrder = {
    orderNumber: orderNum,
    items: [...STATE.cart],
    total: total,
    fulfillment: STATE.selectedFulfillment
  };

  // Switch to confirmation view
  document.getElementById('checkout-view').classList.remove('active');
  const confView = document.getElementById('confirmation-view');
  confView.style.display = 'block';

  document.getElementById('conf-order-number').textContent = orderNum;
  document.getElementById('conf-fulfillment-method').textContent = 
    STATE.selectedFulfillment === 'pickup' ? 'Penang Store Concept Collection (FREE)' : 'Tracked Courier Express (+RM 12.00)';
  document.getElementById('conf-total-val').textContent = formatRM(total);
  
  const confItemsList = document.getElementById('conf-items-list');
  confItemsList.innerHTML = STATE.lastOrder.items.map(item => `
    <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed rgba(116, 103, 92, 0.2);">
      <span>${item.qty}x ${escapeHTML(item.name)}</span>
      <span style="font-weight: 600;">${formatRM(item.price * item.qty)}</span>
    </li>
  `).join('');

  // Clear cart & storage
  STATE.cart = [];
  saveCartToStorage();
  updateBagUI();
  renderCatalog();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Navigation & Filters ---
function filterCategory(cat, element) {
  STATE.currentCategory = cat;
  document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  } else {
    // Sync button state by value
    document.querySelectorAll('.cat-tab').forEach(t => {
      if (t.dataset.cat === cat) t.classList.add('active');
    });
  }
  renderCatalog();
}

function handleSearch(query) {
  STATE.searchQuery = query;
  renderCatalog();
}

function handleSort(val) {
  STATE.sortBy = val;
  renderCatalog();
}

function resetFilters() {
  STATE.searchQuery = '';
  STATE.currentCategory = 'all';
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.cat-tab[data-cat="all"]')?.classList.add('active');
  renderCatalog();
}

function navigateTo(elementId) {
  returnToStore();
  const el = document.getElementById(elementId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderMarketplace();
  updateBagUI();

  // Hero direct foil card click link
  const heroFoilLink = document.getElementById('hero-lunar-foil-link');
  if (heroFoilLink) {
    heroFoilLink.addEventListener('click', (e) => {
      e.preventDefault();
      openProductModal('prod-2');
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCartDrawer();
    }
  });
});
