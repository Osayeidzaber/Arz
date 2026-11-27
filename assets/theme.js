/**
 * Theme JavaScript
 * Handles cart drawer, mobile menu, product gallery, and interactions
 */

document.addEventListener('DOMContentLoaded', function () {
  // Header scroll behavior
  initHeaderScroll();
  initDynamicHeaderSpacing();

  // Cart Drawer Functions
  initCartDrawer();

  // Cart Page Functions
  initCartPage();

  // Mobile Menu
  initMobileMenu();

  // Product Gallery
  initProductGallery();

  // Product Form
  initProductForm();

  // Quick Add Buttons
  initQuickAdd();

  // Quantity Selectors
  initQuantitySelectors();

  // Scroll Animations
  initScrollAnimations();

  // Product Card Slideshow
  initProductCardSlideshow();

  // Hover Video
  initHoverVideo();

  // Product Recommendations
  initProductRecommendations();

  // Couture Toggle
  initCoutureToggle();

  // Mega Menu Behavior
  initMegaMenuBorders();

  // WhatsApp Ordering
  initWhatsAppOrdering();
  initCartWhatsAppOrdering();
  initCartDrawerWhatsAppOrdering();
});

// =====================
// Header Scroll Behavior
// =====================
/**
 * Initializes header scroll behavior to add/remove scrolled state
 * Uses requestAnimationFrame for optimal performance
 * @returns {void}
 */
function initHeaderScroll() {
  const header = document.querySelector('.header-wrapper');
  if (!header) return;

  const scrollThreshold = 100;
  let lastScrollTop = 0;

  /**
   * Handles scroll event and updates header state
   * @returns {void}
   */
  function handleScroll() {
    const currentScroll = window.scrollY;

    // Add/remove scrolled background
    if (currentScroll > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Hide/Show logic based on direction
    // Only hide after passing the threshold to avoid glitching at the very top
    if (currentScroll > scrollThreshold) {
      if (currentScroll > lastScrollTop) {
        // Scrolling Down
        header.classList.add('header-wrapper--hidden');
      } else {
        // Scrolling Up
        header.classList.remove('header-wrapper--hidden');
      }
    } else {
      // Always show at the top
      header.classList.remove('header-wrapper--hidden');
    }

    lastScrollTop = Math.max(0, currentScroll); // Prevent negative scroll values
  }

  // Initial check
  handleScroll();

  // Throttled scroll handler using requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// =====================
// Cart Drawer
// =====================
/**
 * Initializes cart drawer functionality
 * Handles opening/closing, overlay clicks, escape key, and quantity updates
 * @returns {void}
 */
function initCartDrawer() {
  const drawer = document.getElementById('CartDrawer');
  if (!drawer) return;

  // Close on overlay click
  const overlay = drawer.querySelector('.cart-drawer__overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCartDrawer);
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeCartDrawer();
    }
  });

  // Quantity buttons in cart
  drawer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const line = btn.dataset.line;

    if (action === 'increase') {
      updateCartQuantity(line, 1);
    } else if (action === 'decrease') {
      updateCartQuantity(line, -1);
    } else if (action === 'remove') {
      updateCartQuantity(line, 0);
    }
  });
}

/**
 * Opens the cart drawer
 * @returns {void}
 */
window.openCartDrawer = function () {
  const drawer = document.getElementById('CartDrawer');
  if (drawer) {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus management for accessibility
    const firstFocusable = drawer.querySelector('button, a, input');
    if (firstFocusable) firstFocusable.focus();
  }
};

/**
 * Closes the cart drawer
 * @returns {void}
 */
window.closeCartDrawer = function () {
  const drawer = document.getElementById('CartDrawer');
  if (drawer) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

/**
 * Updates cart item quantity
 * @param {number|string} line - Line item index (1-based)
 * @param {number} change - Quantity change (-1, 0, or 1)
 * @returns {Promise<void>}
 */
async function updateCartQuantity(line, change) {
  try {
    const cartResponse = await fetch(window.routes.cart_url + '.js');
    if (!cartResponse.ok) {
      throw new Error(`Cart fetch failed: ${cartResponse.status}`);
    }
    const cart = await cartResponse.json();
    const items = cart.items || [];

    const currentQty = items[line - 1]?.quantity || 0;
    const newQty = change === 0 ? 0 : currentQty + change;

    const updateResponse = await fetch(window.routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: parseInt(line), quantity: Math.max(0, newQty) })
    });

    if (!updateResponse.ok) {
      throw new Error(`Cart update failed: ${updateResponse.status}`);
    }

    const updatedCart = await updateResponse.json();
    updateCartUI(updatedCart);
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    // Show user-friendly error message
    const drawer = document.getElementById('CartDrawer');
    if (drawer) {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'cart-error';
      errorMsg.textContent = 'Unable to update cart. Please try again.';
      errorMsg.style.cssText = 'padding: 12px; background: #fee; color: #c33; margin: 10px; border-radius: 4px;';
      const itemsContainer = drawer.querySelector('.cart-drawer__items');
      if (itemsContainer) itemsContainer.prepend(errorMsg);
      setTimeout(() => errorMsg.remove(), 5000);
    }
  }
}

/**
 * Updates the cart drawer UI with current cart data
 * @param {Object} cart - Cart data object
 * @returns {Promise<void>}
 */
async function updateCartUI(cart) {
  // Update cart count in header
  if (cart) {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = cart.item_count || 0;
    });
  }

  // Update cart drawer - fetch fresh cart data if not provided or valid
  try {
    let cartData = cart;
    if (!cartData || !cartData.items) {
      const cartResponse = await fetch(window.routes.cart_url + '.js');
      cartData = await cartResponse.json();
    }

    const drawer = document.getElementById('CartDrawer');
    if (!drawer) return;

    const itemsContainer = drawer.querySelector('.cart-drawer__items');
    const footer = drawer.querySelector('.cart-drawer__footer');
    const subtotalEl = drawer.querySelector('#CartDrawerSubtotal');

    if (!itemsContainer) return;

    // Rebuild items HTML
    if (cartData.item_count > 0) {
      let itemsHTML = '';
      cartData.items.forEach((item, index) => {
        const line = index + 1;
        const variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '';
        const imageUrl = item.image ? item.image : '';
        itemsHTML += `
          <div class="cart-drawer__item" data-line="${line}">
            <a href="${item.url}" class="cart-drawer__item-image">
              ${imageUrl ? `<img src="${imageUrl}" alt="${item.product_title}" loading="lazy" width="80" height="100">` : '<div class="cart-drawer__item-placeholder"></div>'}
            </a>
            <div class="cart-drawer__item-details">
              <div class="cart-drawer__item-top">
                <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
                <button type="button" class="cart-drawer__item-remove" data-action="remove" data-line="${line}" aria-label="Remove item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
              ${variantTitle ? `<p class="cart-drawer__item-variant">${variantTitle}</p>` : ''}
              <div class="cart-drawer__item-bottom">
                <div class="cart-drawer__item-quantity">
                  <button type="button" class="qty-btn" data-action="decrease" data-line="${line}">−</button>
                  <span class="qty-value">${item.quantity}</span>
                  <button type="button" class="qty-btn" data-action="increase" data-line="${line}">+</button>
                </div>
                ${(() => {
                  const titleLower = item.product_title.toLowerCase();
                  let autoDiscountAmt = 0;
                  if (titleLower.includes('azraq') || titleLower.includes('nazr') || titleLower.includes('nazar')) autoDiscountAmt = 149900;
                  else if (titleLower.includes('sahara')) autoDiscountAmt = 49900;
                  
                  if (autoDiscountAmt > 0) {
                    const totalAutoDiscount = autoDiscountAmt * item.quantity;
                    const salePrice = Math.max(0, item.original_line_price - totalAutoDiscount);
                    return `
                      <span class="cart-drawer__item-price">
                        <span class="cart-drawer__item-price--compare">${formatMoney(item.original_line_price)}</span>
                        <span class="cart-drawer__item-price--sale">${formatMoney(salePrice)}</span>
                      </span>
                    `;
                  }
                  return `<span class="cart-drawer__item-price">${formatMoney(item.final_line_price)}</span>`;
                })()}
              </div>
            </div>
          </div>
        `;
      });
      itemsContainer.innerHTML = itemsHTML;

      // Update subtotal
      if (subtotalEl) {
        let totalDiscount = 0;
        let originalCartTotal = 0;
        cartData.items.forEach(item => {
          originalCartTotal += item.original_line_price;
          const titleLower = item.product_title.toLowerCase();
          if (titleLower.includes('azraq') || titleLower.includes('nazr') || titleLower.includes('nazar')) totalDiscount += (149900 * item.quantity);
          else if (titleLower.includes('sahara')) totalDiscount += (49900 * item.quantity);
        });

        if (totalDiscount > 0) {
          subtotalEl.innerHTML = `
            <span class="cart-drawer__subtotal--compare">${formatMoney(originalCartTotal)}</span>
            <span class="cart-drawer__subtotal--sale">${formatMoney(Math.max(0, originalCartTotal - totalDiscount))}</span>
          `;
        } else {
          subtotalEl.textContent = formatMoney(cartData.total_price);
        }
      }

      // Show footer if hidden
      if (footer) footer.style.display = 'block';
    } else {
      itemsContainer.innerHTML = `
        <div class="cart-drawer__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M6 6h15l-1.5 9h-12z"/>
            <circle cx="9" cy="20" r="1"/>
            <circle cx="18" cy="20" r="1"/>
          </svg>
          <p>Your cart is empty</p>
          <a href="${window.routes.all_products_collection_url}" class="cart-drawer__shop-btn" onclick="closeCartDrawer()">Start Shopping</a>
        </div>
      `;
      if (footer) footer.style.display = 'none';
    }

    // Re-attach event listeners
    initCartDrawer();
    initCartDrawerWhatsAppOrdering();
  } catch (error) {
    console.error('Error updating cart UI:', error);
  }
}

/**
 * Formats money amount from cents to display format
 * Uses Shopify's formatMoney if available, otherwise falls back to custom formatting
 * @param {number} cents - Price in cents
 * @returns {string} Formatted price string
 */
function formatMoney(cents) {
  // Use Shopify's formatMoney which respects the store's currency settings
  if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
    return Shopify.formatMoney(cents);
  }

  // Fallback: use shop money format from Liquid
  const amount = (cents / 100).toFixed(2);
  let moneyFormat = window.shopMoneyFormat || '{{amount}}';

  // Handle different money format patterns
  if (moneyFormat.includes('{{amount}}')) {
    return moneyFormat.replace(/\{\{amount\}\}/g, amount);
  } else if (moneyFormat.includes('{{ amount }}')) {
    return moneyFormat.replace(/\{\{\s*amount\s*\}\}/g, amount);
  } else if (moneyFormat.includes('amount')) {
    // Generic fallback for any amount placeholder
    return moneyFormat.replace(/amount/g, amount);
  }

  // Ultimate fallback: if format is unknown, use Taka symbol (৳) or default currency
  const currencySymbol = moneyFormat.match(/[^\d\s.,]/)?.[0] || '৳';
  return currencySymbol + amount;
}

window.updateCartDrawer = updateCartUI;

// =====================
// Mobile Menu
// =====================
/**
 * Initializes mobile menu drawer functionality
 * Handles opening/closing and submenu toggles
 * @returns {void}
 */
/**
 * Initializes mobile menu drawer and search overlay functionality
 * Handles opening/closing, accessibility, and submenu toggles
 * @returns {void}
 */
function initMobileMenu() {
  const trigger = document.getElementById('MobileMenuTrigger');
  const drawer = document.getElementById('MobileDrawer');
  const close = document.getElementById('MobileDrawerClose');

  // Search Overlay Elements
  const searchTrigger = document.getElementById('MobileSearchTrigger');
  const searchOverlay = document.getElementById('SearchOverlay');
  const searchClose = document.getElementById('SearchOverlayClose');
  const searchInput = searchOverlay ? searchOverlay.querySelector('.search-overlay__input') : null;

  if (!drawer) return;

  // Mobile Drawer Toggle
  if (trigger) {
    trigger.addEventListener('click', () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      // Focus management
      const firstLink = drawer.querySelector('.mobile-drawer__link');
      if (firstLink) firstLink.focus();
    });
  }

  const closeMenu = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (close) {
    close.addEventListener('click', closeMenu);
  }

  // Search Overlay Toggle
  if (searchTrigger && searchOverlay) {
    searchTrigger.addEventListener('click', () => {
      searchOverlay.classList.add('is-active');
      searchOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (searchInput) setTimeout(() => searchInput.focus(), 100);
    });

    const closeSearch = () => {
      searchOverlay.classList.remove('is-active');
      searchOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('is-active')) {
        closeSearch();
      }
    });
  }

  // Combined Close on Escape for Drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Submenu toggles - Intuitive Row-Click Toggle
  drawer.querySelectorAll('.mobile-drawer__item--has-submenu').forEach(item => {
    const link = item.querySelector('.mobile-drawer__link');
    const toggle = item.querySelector('.mobile-drawer__toggle');

    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = item.classList.contains('is-open');

      // Toggle current
      item.classList.toggle('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', !isOpen);
    };

    // Both link and toggle button now trigger the toggle
    if (link) link.addEventListener('click', handleToggle);
    if (toggle) toggle.addEventListener('click', handleToggle);
  });
}

// =====================
// Product Gallery
// =====================
/**
 * Initializes product image gallery functionality
 * Handles image navigation, dots, arrows, and swipe gestures
 * @returns {void}
 */
function initProductGallery() {
  const gallery = document.querySelector('.product-gallery');
  if (!gallery) return;

  const slides = gallery.querySelectorAll('.product-gallery__slide');
  const dots = gallery.querySelectorAll('.dot');
  const prevBtn = gallery.querySelector('.gallery-arrow.prev');
  const nextBtn = gallery.querySelector('.gallery-arrow.next');
  const status = document.getElementById('GalleryStatus');

  if (slides.length <= 1) return;

  let currentIndex = 0;

  function pauseAllMedia() {
    gallery.querySelectorAll('video').forEach(v => {
      v.pause();
    });
  }

  function showImage(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    pauseAllMedia();

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });

    if (status) {
      const currentSpan = status.querySelector('.current');
      if (currentSpan) currentSpan.textContent = index + 1;
    }

    currentIndex = index;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showImage(i));
  });

  // Swipe support
  let touchStartX = 0;
  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  gallery.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      showImage(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  });
}

// =====================
// Product Form
// =====================
/**
 * Initializes product form functionality
 * Handles variant selection and form submission
 * @returns {void}
 */
function initProductForm() {
  const form = document.querySelector('[data-product-form]');
  if (!form) return;

  // Handle variant selection
  form.querySelectorAll('[data-option-index]').forEach(input => {
    input.addEventListener('change', () => {
      updateVariant(form);
    });
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(window.routes.cart_add_url + '.js', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Add to cart failed: ${response.status}`);
      }

      const cart = await response.json();

      // Check for errors in cart response
      if (cart.errors && cart.errors.length > 0) {
        throw new Error(cart.errors.join(', '));
      }

      // Update cart count
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = cart.item_count || (cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0);
      });

      // Open cart drawer
      openCartDrawer();

      // Refresh cart drawer
      updateCartUI(cart);

    } catch (error) {
      console.error('Error adding to cart:', error);
      // Show user-friendly error
      submitBtn.textContent = 'Error - Try Again';
      submitBtn.style.background = '#c33';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
}

/**
 * Updates variant selection in product form
 * @param {HTMLFormElement} form - Product form element
 * @returns {void}
 */
function updateVariant(form) {
  const options = [];
  form.querySelectorAll('[data-option-index]:checked').forEach(input => {
    options[input.dataset.optionIndex] = input.value;
  });

  // Update selected value displays
  form.querySelectorAll('.selected-value').forEach((el, i) => {
    if (options[i]) {
      el.textContent = options[i];
    }
  });
}

// =====================
// Quick Add
// =====================
/**
 * Initializes quick add to cart buttons on product cards
 * @returns {void}
 */
function initQuickAdd() {
  document.querySelectorAll('.product-card__quick-add').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const variantId = btn.dataset.productId;
      if (!variantId) {
        console.warn('Quick add button missing product ID');
        return;
      }

      btn.classList.add('is-loading');
      const originalText = btn.textContent;

      try {
        const response = await fetch(window.routes.cart_add_url + '.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (!response.ok) {
          throw new Error(`Add to cart failed: ${response.status}`);
        }

        const cart = await response.json();

        // Check for errors in cart response
        if (cart.errors && cart.errors.length > 0) {
          throw new Error(cart.errors.join(', '));
        }

        document.querySelectorAll('[data-cart-count]').forEach(el => {
          el.textContent = cart.item_count || 0;
        });

        openCartDrawer();
        updateCartUI(cart);

      } catch (error) {
        console.error('Quick add error:', error);
        btn.textContent = 'Error';
        btn.style.opacity = '0.5';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.opacity = '';
        }, 2000);
      } finally {
        btn.classList.remove('is-loading');
      }
    });
  });
}

// =====================
// Quantity Selectors
// =====================
/**
 * Initializes quantity selector buttons (increase/decrease)
 * @returns {void}
 */
function initQuantitySelectors() {
  document.querySelectorAll('.product-quantity__selector').forEach(selector => {
    const input = selector.querySelector('.qty-input');
    const decrease = selector.querySelector('[data-action="decrease"]');
    const increase = selector.querySelector('[data-action="increase"]');

    if (!input) return;

    if (decrease) {
      decrease.addEventListener('click', () => {
        const newVal = Math.max(1, parseInt(input.value) - 1);
        input.value = newVal;
      });
    }

    if (increase) {
      increase.addEventListener('click', () => {
        const newVal = Math.min(99, parseInt(input.value) + 1);
        input.value = newVal;
      });
    }
  });
}

// =====================
// Cart Page
// =====================
/**
 * Initializes cart page functionality
 * Handles quantity buttons and updates
 * @returns {void}
 */
function initCartPage() {
  const cartPage = document.querySelector('.cart-page');
  if (!cartPage) return;

  // Quantity buttons
  cartPage.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;

    const action = btn.dataset.action;
    const input = btn.parentElement.querySelector('.qty-input');
    if (!input) return;

    let newVal = parseInt(input.value);

    if (action === 'increase') {
      newVal += 1;
    } else if (action === 'decrease') {
      newVal = Math.max(0, newVal - 1);
    }

    input.value = newVal;
  });
}

// =====================
// Scroll Animations
// =====================
/**
 * Initializes scroll-triggered animations using Intersection Observer
 * Animates elements with .slide-up and .fade-in classes when they enter viewport
 * @returns {void}
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.slide-up, .fade-in, .animate-on-scroll');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// =====================
// Product Card Slideshow
// =====================
/**
 * Initializes manual navigation buttons on product cards
 * Handles previous/next arrows and progress bar updates
 * @returns {void}
 */
function initProductCardSlideshow() {
  const wrappers = document.querySelectorAll('[data-slideshow-wrapper]');

  wrappers.forEach(wrapper => {
    const images = wrapper.querySelectorAll('.product-card__image');
    const prevBtn = wrapper.querySelector('.product-card__arrow.prev');
    const nextBtn = wrapper.querySelector('.product-card__arrow.next');
    const indicator = wrapper.querySelector('.product-card__progress-indicator');

    if (images.length <= 1) return;

    let currentIndex = 0;

    /**
     * Updates the visible image and progress indicator
     * @param {number} newIndex - The index to show
     */
    function updateSlide(newIndex) {
      // Handle wrapping
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      currentIndex = newIndex;

      // Update images - use classes for visibility
      images.forEach((img, i) => {
        if (i === currentIndex) {
          img.style.display = '';
          img.classList.add('is-active');
        } else {
          img.style.display = '';
          img.classList.remove('is-active');
        }
      });

      // Update progress indicator
      if (indicator) {
        indicator.style.transform = `translateX(${currentIndex * 100}%)`;
      }
    }

    // Expose updateSlide to the wrapper for external control (Couture Preview)
    wrapper.updateSlide = updateSlide;

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateSlide(currentIndex + 1);
      });
    }

    const card = wrapper.closest('.product-card');
    if (card) {
      // Hover → jump to image 2 (so arrows continue from there)
      card.addEventListener('mouseenter', () => {
        const toggle = document.getElementById('modelToggle');
        if (toggle && toggle.checked) return;
        if (currentIndex === 0 && images.length > 1) {
          updateSlide(1);
        }
      });

      // Mouse leave → reset to image 1
      card.addEventListener('mouseleave', () => {
        const toggle = document.getElementById('modelToggle');
        if (toggle && toggle.checked) return;
        updateSlide(0);
      });
    }
  });
}

// =====================
// Hover Video
// =====================
/**
 * Initializes hover video behavior for product cards
 * Plays the video on hover and resets it on mouse leave
 * @returns {void}
 */
function initHoverVideo() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    const video = card.querySelector('.product-card__video-player');
    if (!video) return;

    // Remove existing listeners to avoid duplicates
    card.removeEventListener('mouseenter', card._playVideoHandler);
    card.removeEventListener('mouseleave', card._stopVideoHandler);

    // Use event delegation or direct binding
    // Since we call this on page load and after recommendations load, direct binding is fine
    
    // Clear existing listeners to prevent duplicates if re-initialized
    const playVideo = () => {
      const videoWrapper = card.querySelector('.product-card__video');
      if (videoWrapper) videoWrapper.classList.add('is-playing');
      
      // Force muted for autoplay policy
      video.muted = true;
      
      // Ensure video is ready to play
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play was prevented
          console.log("Hover video play prevented:", error);
          if (videoWrapper) videoWrapper.classList.remove('is-playing');
        });
      }
    };

    const stopVideo = () => {
      const videoWrapper = card.querySelector('.product-card__video');
      if (videoWrapper) videoWrapper.classList.remove('is-playing');
      video.pause();
      video.currentTime = 0;
    };

    // Store handlers on the element so they can be removed later
    card._playVideoHandler = playVideo;
    card._stopVideoHandler = stopVideo;

    // Use 'mouseenter' and 'mouseleave' for reliable desktop hover
    card.addEventListener('mouseenter', playVideo);
    card.addEventListener('mouseleave', stopVideo);

    // Support for touch devices (first tap plays video)
    card.removeEventListener('touchstart', card._touchVideoHandler);
    const touchHandler = function() {
      if (video.paused) {
        playVideo();
      } else {
        stopVideo();
      }
    };
    card._touchVideoHandler = touchHandler;
    card.addEventListener('touchstart', touchHandler, { passive: true });
  });
}

/**
 * Initializes product recommendations by fetching them from Shopify's API
 * and injecting the returned HTML into the container.
 * @returns {void}
 */
function initProductRecommendations() {
  const container = document.querySelector('.product-recommendations');
  const target = document.getElementById('RecommendationsGrid');

  if (!container || !target) return;

  const url = container.dataset.url;
  if (!url) return;

  fetch(url)
    .then(response => response.text())
    .then(text => {
      const html = new DOMParser().parseFromString(text, 'text/html');
      const recommendations = html.querySelector('.product-grid');

      if (recommendations && recommendations.innerHTML.trim().length > 0) {
        target.innerHTML = recommendations.innerHTML;
        // Re-initialize interactive elements for new cards
        initQuickAdd();
        initProductCardSlideshow();
        initHoverVideo();
        initScrollAnimations();
      } else {
        container.style.display = 'none';
      }
    })
    .catch(err => {
      console.error('Failed to load recommendations:', err);
      container.style.display = 'none';
    });
}

// =====================
// Dynamic Header Spacing
// =====================
function initDynamicHeaderSpacing() {
  const updateHeight = () => {
    const header = document.querySelector('.header');
    const announcement = document.querySelector('.announcement-bar');
    let totalHeight = 0;

    if (header) totalHeight += header.getBoundingClientRect().height;
    if (announcement) totalHeight += announcement.getBoundingClientRect().height;

    if (totalHeight > 40) {
      document.documentElement.style.setProperty('--header-total-height', totalHeight + 'px');
    }
  };

  window.addEventListener('load', updateHeight);
  window.addEventListener('resize', updateHeight);

  updateHeight();
  setTimeout(updateHeight, 200);

  const header = document.querySelector('.header');
  if (header) {
    new ResizeObserver(updateHeight).observe(header);
  }
}

// =====================
// Couture Preview Toggle
// =====================
/**
 * Initializes the Couture Preview (Model View) toggle
 * Syncs with the product card slideshow to prevent state glitches
 * @returns {void}
 */
function initCoutureToggle() {
  const toggle = document.getElementById('modelToggle');
  // Loop through all toggles if there are multiple (e.g. mobile/desktop split) or just by ID
  // The ID is unique, so just one.

  if (!toggle) return;

  function applyModelView(showModel) {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      const wrapper = card.querySelector('[data-slideshow-wrapper]');
      const images = card.querySelectorAll('.product-card__image');

      if (images.length < 2) return;

      if (wrapper && typeof wrapper.updateSlide === 'function') {
        // Use the slideshow's internal method to Sync state
        // Model view = Index 1 (if exists), Product view = Index 0
        wrapper.updateSlide(showModel ? 1 : 0);
      } else {
        // Fallback for non-slideshow cards (manual DOM toggle)
        images.forEach((img, index) => {
          const shouldShow = showModel ? (index === 1) : (index === 0);

          if (shouldShow) {
            img.style.display = '';
            img.classList.add('is-active');
          } else {
            img.style.display = '';
            img.classList.remove('is-active');
          }
        });
      }

      if (showModel) {
        card.classList.add('model-view');
      } else {
        card.classList.remove('model-view');
      }
    });
  }

  toggle.addEventListener('change', (e) => applyModelView(e.target.checked));

  // Initial check
  if (toggle.checked) {
    applyModelView(true);
  }
}

// =====================
// Product Size Specs & Converter
// =====================
// Initialize global unit state if not set
window.currentSizeUnit = window.currentSizeUnit || 'in';

function initSizeSpecs() {
  const display = document.getElementById('SizeSpecsDisplay');
  if (!display) {
    console.warn("InitSizeSpecs: Display element #SizeSpecsDisplay not found");
    return;
  }

  window.updateSizeSpecsUI = (sizeValue) => {
    // Retry mechanism for config race condition
    if (!window.productSpecConfig) {
      console.warn("InitSizeSpecs: Config missing, retrying...");
      setTimeout(() => window.updateSizeSpecsUI(sizeValue), 500);
      return;
    }

    if (!window.productSpecConfig.data) {
      console.error("InitSizeSpecs: Config found but no data", window.productSpecConfig);
      return;
    }

    // Normalize key
    const data = window.productSpecConfig.data[sizeValue] ||
      window.productSpecConfig.data[sizeValue.charAt(0)] ||
      null;

    console.log("SizeSpecs Update:", sizeValue, "Data:", data);

    if (data) {
      const values = data.split(',');
      const labels = window.productSpecConfig.labels;
      const unit = window.currentSizeUnit || 'in';

      let html = '<div class="specs-grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">';
      labels.forEach((label, index) => {
        let val = values[index] || '-';
        if (unit === 'cm' && val !== '-' && !isNaN(parseFloat(val))) {
          val = (parseFloat(val) * 2.54).toFixed(1);
        }
        html += `
          <div class="spec-item">
            <div class="spec-label" style="font-size: 10px; color: #666; text-transform: uppercase;">${label}</div>
            <div class="spec-value" style="font-size: 14px; font-weight: 600;">${val}</div>
          </div>
        `;
      });
      html += '</div>';
      display.innerHTML = html;
    } else {
      display.innerHTML = '<div class="specs-placeholder">CHOOSE YOUR SIZE</div>';
    }
  };

  const radios = document.querySelectorAll('.size-radio');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) window.updateSizeSpecsUI(e.target.value);
    });
  });

  const checked = document.querySelector('.size-radio:checked');
  if (checked) window.updateSizeSpecsUI(checked.value);
}

function initSizeConverter() {
  const toggleContainers = document.querySelectorAll('.size-unit-toggle');
  if (toggleContainers.length === 0) return;

  toggleContainers.forEach(container => {
    const buttons = container.querySelectorAll('.unit-btn');
    const sizeVals = document.querySelectorAll('.size-val');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const unit = btn.dataset.unit;
        window.currentSizeUnit = unit;

        // Update UI for all buttons across possible multiple toggles
        document.querySelectorAll('.unit-btn').forEach(b => {
          const isActive = b.dataset.unit === unit;
          b.classList.toggle('active', isActive);
          b.style.background = isActive ? '#000' : 'transparent';
          b.style.color = isActive ? '#fff' : '#000';
        });

        // Update Table Values
        sizeVals.forEach(val => {
          const inch = parseFloat(val.dataset.inch);
          if (unit === 'cm') {
            val.textContent = (inch * 2.54).toFixed(1);
          } else {
            val.textContent = val.dataset.inch;
          }
        });

        // Update Detail Specs
        const checked = document.querySelector('.size-radio:checked');
        if (checked && typeof window.updateSizeSpecsUI === 'function') {
          window.updateSizeSpecsUI(checked.value);
        }
      });
    });
  });
}

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
  initCoutureToggle();
  initSizeSpecs();
  initSizeConverter();
});
// =====================
// Desktop Mega Menu Behavior
// =====================
function initMegaMenuBorders() {
  const headerWrapper = document.querySelector('.header-wrapper');
  const megaMenuItems = document.querySelectorAll('.has-mega-menu');

  megaMenuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      headerWrapper.classList.add('mega-menu-open');
    });
    item.addEventListener('mouseleave', () => {
      headerWrapper.classList.remove('mega-menu-open');
    });
  });
}

// =====================
// WhatsApp Ordering
// =====================
function initWhatsAppOrdering() {
  const whatsappBtn = document.getElementById('WhatsAppOrderBtn');
  if (!whatsappBtn) return;

  let productJson = null;
  try {
    const productJsonEl = document.getElementById('ProductJson');
    if (productJsonEl) {
      productJson = JSON.parse(productJsonEl.textContent);
    }
  } catch (e) {
    console.error('Failed to parse ProductJson:', e);
  }

  let whatsappConfig = null;
  try {
    const configEl = document.getElementById('WhatsAppConfig');
    if (configEl) {
      whatsappConfig = JSON.parse(configEl.textContent);
    }
  } catch (e) {
    console.error('Failed to parse WhatsAppConfig:', e);
  }

  if (!productJson || !whatsappConfig) return;

  let currentVariant = productJson.selected_or_first_available_variant;

  function updateWhatsAppUrl() {
    if (!currentVariant) return;

    const defaultMessage = "Hello! I want to order:\n\nProduct: {product_title}\nVariant: {product_variant}\nPrice: {product_price}\nQuantity: {quantity}\n\nLink: {product_link}";
    let message = whatsappConfig.messageTemplate || defaultMessage;
    message = message.replace(/{product_title}/g, whatsappConfig.productTitle);
    message = message.replace(/{product_variant}/g, currentVariant.title || '');
    message = message.replace(/{product_price}/g, formatMoney(currentVariant.price));
    message = message.replace(/{quantity}/g, '1');
    message = message.replace(/{product_link}/g, whatsappConfig.productUrl);

    const phone = whatsappConfig.phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    whatsappBtn.href = whatsappUrl;
  }

  // Listen for variant changes
  document.querySelectorAll('.color-radio, .size-radio, .variant-select').forEach(input => {
    input.addEventListener('change', () => {
      // Find the selected variant
      const options = [];
      document.querySelectorAll('.color-radio:checked, .size-radio:checked, .variant-select').forEach(el => {
        if (el.tagName === 'SELECT') {
          options.push(el.value);
        } else {
          options.push(el.value);
        }
      });

      // Find matching variant in productJson
      currentVariant = productJson.variants.find(variant => {
        return variant.options.every((opt, i) => opt === options[i]);
      }) || productJson.selected_or_first_available_variant;

      updateWhatsAppUrl();
    });
  });

  // Initial URL setup
  updateWhatsAppUrl();
}

function initCartWhatsAppOrdering() {
  const cartWhatsAppBtn = document.getElementById('CartWhatsAppBtn');
  if (!cartWhatsAppBtn) return;

  let cartWhatsAppConfig = null;
  try {
    const configEl = document.getElementById('CartWhatsAppConfig');
    if (configEl) {
      cartWhatsAppConfig = JSON.parse(configEl.textContent);
    }
  } catch (e) {
    console.error('Failed to parse CartWhatsAppConfig:', e);
  }

  if (!cartWhatsAppConfig) return;

  // Build message
  let message = 'Hello! I want to order these items:\n\n';
  cartWhatsAppConfig.cartItems.forEach(item => {
    message += `- ${item.product_title}`;
    if (item.variant_title && item.variant_title !== 'Default Title') {
      message += ` (${item.variant_title})`;
    }
    message += ` x ${item.quantity}\n`;
    message += `  Price: ${formatMoney(item.final_line_price)}\n\n`;
  });

  const phone = cartWhatsAppConfig.phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  cartWhatsAppBtn.href = whatsappUrl;
}

function initCartDrawerWhatsAppOrdering() {
  const cartDrawerWhatsAppBtn = document.getElementById('CartDrawerWhatsAppBtn');
  if (!cartDrawerWhatsAppBtn) return;

  let cartDrawerWhatsAppConfig = null;
  try {
    const configEl = document.getElementById('CartDrawerWhatsAppConfig');
    if (configEl) {
      cartDrawerWhatsAppConfig = JSON.parse(configEl.textContent);
    }
  } catch (e) {
    console.error('Failed to parse CartDrawerWhatsAppConfig:', e);
  }

  if (!cartDrawerWhatsAppConfig) return;

  // Build message
  let message = 'Hello! I want to order these items:\n\n';
  cartDrawerWhatsAppConfig.cartItems.forEach(item => {
    message += `- ${item.product_title}`;
    if (item.variant_title && item.variant_title !== 'Default Title') {
      message += ` (${item.variant_title})`;
    }
    message += ` x ${item.quantity}\n`;
    message += `  Price: ${formatMoney(item.final_line_price)}\n\n`;
  });

  const phone = cartDrawerWhatsAppConfig.phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  cartDrawerWhatsAppBtn.href = whatsappUrl;
}
