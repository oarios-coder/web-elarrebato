/* --------------------------------------------------
   EL ARREBATO - Premium Malbec 2025
   Lógica de Aplicación Storefront (JavaScript Vanilla)
   -------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // A. Base de Datos / Persistencia Local Storage
    // --------------------------------------------------
    const defaultData = {
        // Precios y Stock
        priceBottle: 18500, // Precio base de 1 botella ARS
        stock: 120, // Stock total
        freeShippingMin: 80000, // Importe mínimo para envío gratis
        shippingRates: {
            mendoza: 3500,
            buenosAires: 5500,
            resto: 7000
        },
        discountPacks: {
            pack3: 5,  // 5% desc
            caja6: 10, // 10% desc
            caja12: 15 // 15% desc
        },
        
        // Ficha Técnica & Textos Cata
        tastingNotes: "El Arrebato Malbec 2025 presenta un color rojo violáceo profundo y brillante. En nariz se destacan notas intensas de frutos rojos maduros, ciruelas y violetas, entrelazadas con sutiles aromas a vainilla y chocolate aportados por su paso por madera. En boca es un vino de gran estructura, con taninos dulces y redondos, acidez equilibrada y un final largo y persistente que invita a un nuevo trago.",
        
        // Arte
        artAuthor: "Artista Contemporáneo Mendocino",
        artInspiration: "Inspirada en el instante del atardecer en el Valle de Uco, donde la luz cálida abraza las montañas y la figura femenina representa la tierra firme, la sensualidad del vino y el espíritu libre de los encuentros sinceros.",
        artWomanMeaning: "Simboliza la Madre Tierra (Pachamama) y la inspiración artística que fluye en cada charla entre amigos.",
        artPentagonMeaning: "Representa el 'Pentágono de los amigos': cinco vértices que sostienen los momentos más preciados de la vida: Confianza, Risas, Anécdotas, Lealtad y Unión.",
        
        // Historia
        brandHistory: "El Arrebato nació una tarde de otoño en Gualtallary, Valle de Uco, cuando cinco amigos de toda la vida compartían un asado bajo el cielo mendocino. En medio de risas y anécdotas, surgió el deseo de crear un vino que plasmara esa hermandad. 'Familia Arreguez' materializó este sueño, seleccionando las mejores uvas Malbec para embotellar no solo un varietal de alta gama, sino un testimonio líquido del afecto y los encuentros que merecen celebrarse.",
        
        // Contacto
        cellphone: "+54 9 261 555-5555",
        email: "hola@elarrebatowines.com.ar",
        address: "Ruta Provincial 89, Gualtallary, Valle de Uco, Mendoza, Argentina",
        razonSocial: "Familia Arreguez S.A. - CUIT: 30-71689234-9",
        fiscalInfo: "Bodega INV N° A70068 - Bebidas alcohólicas de venta exclusiva a mayores de 18 años.",
        
        // Testimonios por defecto
        testimonials: [
            { id: 1, name: "Santiago M.", text: "Un Malbec excelente. Lo abrimos en una cena de amigos y a todos les encantó. El diseño de la etiqueta es una obra de arte.", stars: 5, verified: true, active: true },
            { id: 2, name: "Valentina G.", text: "Frutos rojos intensos, taninos súper suaves. Es ideal para regalar o para disfrutar en una velada especial. 100% recomendado.", stars: 5, verified: true, active: true },
            { id: 3, name: "Martín P.", text: "Excelente relación precio/calidad para ser un Malbec premium del Valle de Uco. El envío llegó rapidísimo a CABA.", stars: 5, verified: true, active: true }
        ]
    };

    // Inicializar localStorage si no existe
    if (!localStorage.getItem('el_arrebato_db')) {
        localStorage.setItem('el_arrebato_db', JSON.stringify(defaultData));
    }
    
    // Obtener los datos actualizados de la DB
    const getDB = () => JSON.parse(localStorage.getItem('el_arrebato_db'));
    const saveDB = (data) => localStorage.setItem('el_arrebato_db', JSON.stringify(data));

    let db = getDB();

    // --------------------------------------------------
    // B. Elementos del DOM e Inicialización
    // --------------------------------------------------
    const ageGate = document.getElementById('age-gate');
    const btnAgeYes = document.getElementById('age-yes');
    const btnAgeNo = document.getElementById('age-no');
    
    const header = document.querySelector('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDiscount = document.getElementById('cart-discount');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    
    const btnApplyPromo = document.getElementById('apply-promo-btn');
    const inputPromoCode = document.getElementById('promo-code-input');
    const promoMessage = document.getElementById('promo-message');
    
    const btnCheckout = document.getElementById('btn-checkout');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckout = document.getElementById('close-checkout');
    
    // --------------------------------------------------
    // C. Control del Age Gate (Verificación de Edad)
    // --------------------------------------------------
    const checkAgeGate = () => {
        if (localStorage.getItem('age_verified') === 'true') {
            ageGate.classList.add('hidden');
            setTimeout(() => ageGate.style.display = 'none', 800);
        } else {
            ageGate.style.display = 'flex';
        }
    };

    btnAgeYes.addEventListener('click', () => {
        localStorage.setItem('age_verified', 'true');
        ageGate.classList.add('hidden');
        setTimeout(() => ageGate.style.display = 'none', 800);
        
        // Simular tracking
        trackEvent('Age Gate Passed', { age: '18+' });
    });

    btnAgeNo.addEventListener('click', () => {
        // Redirigir a una página de consumo responsable o buscador
        window.location.href = 'https://www.argentina.gob.ar/salud/consumo-responsable-de-alcohol';
    });

    checkAgeGate();

    // --------------------------------------------------
    // D. Navegación & Header
    // --------------------------------------------------
    // Scroll header background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active link on scroll
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 120;
        
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
                const id = section.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    });

    // Menú Hamburguesa
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

    // --------------------------------------------------
    // E. Renderizar Contenido Dinámico desde DB
    // --------------------------------------------------
    const renderDynamicContent = () => {
        db = getDB(); // Recargar datos frescos
        
        // Ficha Cata
        const tastingElement = document.getElementById('db-tasting-notes');
        if (tastingElement) tastingElement.textContent = db.tastingNotes;
        
        // Historia
        const historyElement = document.getElementById('db-brand-history');
        if (historyElement) historyElement.innerHTML = `<p>${db.brandHistory.replace(/\n\n/g, '</p><p>')}</p>`;
        
        // Arte
        const artAuthorEl = document.getElementById('db-art-author');
        if (artAuthorEl) artAuthorEl.textContent = db.artAuthor;
        const artInspirationEl = document.getElementById('db-art-inspiration');
        if (artInspirationEl) artInspirationEl.textContent = db.artInspiration;
        const artWomanEl = document.getElementById('db-art-woman');
        if (artWomanEl) artWomanEl.textContent = db.artWomanMeaning;
        const artPentagonEl = document.getElementById('db-art-pentagon');
        if (artPentagonEl) artPentagonEl.textContent = db.artPentagonMeaning;
        
        // Datos de Bodega Footer & Contacto
        const addressEl = document.getElementById('db-address');
        if (addressEl) addressEl.textContent = db.address;
        const emailEl = document.getElementById('db-email');
        if (emailEl) emailEl.innerHTML = `<a href="mailto:${db.email}">${db.email}</a>`;
        const phoneEl = document.getElementById('db-phone');
        if (phoneEl) phoneEl.innerHTML = `<a href="tel:${db.cellphone}">${db.cellphone}</a>`;
        
        // Legales
        const razonSocialEl = document.getElementById('db-razon-social');
        if (razonSocialEl) razonSocialEl.textContent = db.razonSocial;
        const fiscalInfoEl = document.getElementById('db-fiscal-info');
        if (fiscalInfoEl) fiscalInfoEl.textContent = db.fiscalInfo;
        
        // Precios en la sección de E-commerce
        renderProductPriceOptions();
        
        // Render Testimonios
        renderTestimonials();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const renderProductPriceOptions = () => {
        const bottlePrice = db.priceBottle;
        
        // Configurar opciones de packs
        const optionsData = [
            {
                key: 'bottle1',
                name: '1 Botella (750 ml)',
                bottles: 1,
                discount: 0,
                price: bottlePrice,
                tag: ''
            },
            {
                key: 'pack3',
                name: 'Pack de 3 Botellas',
                bottles: 3,
                discount: db.discountPacks.pack3,
                price: bottlePrice * 3 * (1 - db.discountPacks.pack3 / 100),
                tag: 'Recomendado'
            },
            {
                key: 'caja6',
                name: 'Caja de 6 Botellas',
                bottles: 6,
                discount: db.discountPacks.caja6,
                price: bottlePrice * 6 * (1 - db.discountPacks.caja6 / 100),
                tag: 'Más elegido'
            },
            {
                key: 'caja12',
                name: 'Caja de 12 Botellas',
                bottles: 12,
                discount: db.discountPacks.caja12,
                price: bottlePrice * 12 * (1 - db.discountPacks.caja12 / 100),
                tag: 'Mejor valor'
            }
        ];
        
        const presentationSelector = document.getElementById('presentation-selector');
        if (!presentationSelector) return;
        
        presentationSelector.innerHTML = '';
        
        optionsData.forEach((opt, idx) => {
            const isSelected = idx === 2; // Seleccionado por defecto: Caja de 6
            const unitPrice = opt.price / opt.bottles;
            const discountLabel = opt.discount > 0 ? `Ahorrás ${opt.discount}%` : '';
            const highlightBadge = opt.tag ? `<span class="option-badge-highlight">${opt.tag}</span>` : '';
            const originalPriceLabel = opt.discount > 0 ? `<span class="presentation-price-original">${formatCurrency(bottlePrice * opt.bottles)}</span>` : '';
            
            const div = document.createElement('div');
            div.className = `presentation-option ${isSelected ? 'selected' : ''}`;
            div.dataset.key = opt.key;
            div.dataset.price = opt.price;
            div.dataset.bottles = opt.bottles;
            div.dataset.name = opt.name;
            
            div.innerHTML = `
                ${highlightBadge}
                <div class="presentation-info">
                    <div class="option-radio"></div>
                    <div class="presentation-details">
                        <span class="presentation-name">${opt.name}</span>
                        ${discountLabel ? `<span class="presentation-discount-tag">${discountLabel}</span>` : ''}
                    </div>
                </div>
                <div class="presentation-price-box">
                    <span class="presentation-price">${originalPriceLabel}${formatCurrency(opt.price)}</span>
                    <span class="presentation-price-unit">${formatCurrency(unitPrice)} por botella</span>
                </div>
            `;
            
            div.addEventListener('click', () => {
                document.querySelectorAll('.presentation-option').forEach(o => o.classList.remove('selected'));
                div.classList.add('selected');
                updateSelectedPresentationInfo();
            });
            
            presentationSelector.appendChild(div);
        });
        
        updateSelectedPresentationInfo();
    };

    let selectedPresentation = null;
    
    const updateSelectedPresentationInfo = () => {
        const selectedEl = document.querySelector('.presentation-option.selected');
        if (!selectedEl) return;
        
        selectedPresentation = {
            key: selectedEl.dataset.key,
            name: selectedEl.dataset.name,
            price: parseFloat(selectedEl.dataset.price),
            bottles: parseInt(selectedEl.dataset.bottles)
        };
        
        // Actualizar stock indicador visual
        const stockEl = document.getElementById('db-stock-indicator');
        if (stockEl) {
            const requestedQty = parseInt(document.getElementById('buy-qty').value) * selectedPresentation.bottles;
            
            if (db.stock <= 0) {
                stockEl.className = 'stock-indicator-text stock-out';
                stockEl.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Agotado temporalmente`;
                document.getElementById('btn-add-cart').disabled = true;
                document.getElementById('btn-buy-now').disabled = true;
            } else if (db.stock < 12 || requestedQty >= db.stock) {
                stockEl.className = 'stock-indicator-text stock-warning';
                stockEl.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Últimas unidades disponibles (Stock: ${db.stock} botellas)`;
                document.getElementById('btn-add-cart').disabled = false;
                document.getElementById('btn-buy-now').disabled = false;
            } else {
                stockEl.className = 'stock-indicator-text stock-available';
                stockEl.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> En stock disponible`;
                document.getElementById('btn-add-cart').disabled = false;
                document.getElementById('btn-buy-now').disabled = false;
            }
        }
    };

    // Control de cantidad en selector de compra
    const buyQtyInput = document.getElementById('buy-qty');
    const btnBuyQtyMinus = document.getElementById('buy-qty-minus');
    const btnBuyQtyPlus = document.getElementById('buy-qty-plus');

    if (buyQtyInput && btnBuyQtyMinus && btnBuyQtyPlus) {
        btnBuyQtyMinus.addEventListener('click', () => {
            let current = parseInt(buyQtyInput.value);
            if (current > 1) {
                buyQtyInput.value = current - 1;
                updateSelectedPresentationInfo();
            }
        });
        
        btnBuyQtyPlus.addEventListener('click', () => {
            let current = parseInt(buyQtyInput.value);
            // Comprobar límites de stock
            const totalBottles = (current + 1) * selectedPresentation.bottles;
            if (totalBottles <= db.stock) {
                buyQtyInput.value = current + 1;
                updateSelectedPresentationInfo();
            } else {
                alert("No hay suficiente stock para agregar esa cantidad de botellas.");
            }
        });
        
        buyQtyInput.addEventListener('change', () => {
            let current = parseInt(buyQtyInput.value);
            if (isNaN(current) || current < 1) {
                buyQtyInput.value = 1;
            }
            // Controlar stock
            const totalBottles = parseInt(buyQtyInput.value) * selectedPresentation.bottles;
            if (totalBottles > db.stock) {
                alert(`Stock insuficiente. Solo quedan ${db.stock} botellas.`);
                buyQtyInput.value = Math.floor(db.stock / selectedPresentation.bottles) || 1;
            }
            updateSelectedPresentationInfo();
        });
    }

    // --------------------------------------------------
    // F. Gestión del Carrito (State & Eventos)
    // --------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('el_arrebato_cart')) || [];
    let promoCodeApplied = localStorage.getItem('applied_promo_code') || '';
    let promoDiscountPct = parseFloat(localStorage.getItem('applied_promo_discount_pct')) || 0;
    
    // Objeto para envío
    let shippingCost = 0;
    let zipCodeSearched = '';

    const saveCart = () => {
        localStorage.setItem('el_arrebato_cart', JSON.stringify(cart));
        localStorage.setItem('applied_promo_code', promoCodeApplied);
        localStorage.setItem('applied_promo_discount_pct', promoDiscountPct.toString());
        updateCartUI();
    };

    const updateCartUI = () => {
        // Calcular badge de items totales
        const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartBadge.textContent = totalItemsCount;
        cartBadge.style.display = totalItemsCount > 0 ? 'flex' : 'none';
        
        // Renderizar items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty-message">
                        <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--color-gray-warm)" fill="none" stroke-width="1" style="margin-bottom: 16px;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <p>Tu carrito está vacío.</p>
                    </div>
                `;
            } else {
                cart.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    itemEl.innerHTML = `
                        <img src="public/images/arrebato_frente.png" alt="Botella El Arrebato" class="cart-item-img">
                        <div class="cart-item-details">
                            <span class="cart-item-name">${item.name}</span>
                            <span class="cart-item-format">Presentación de ${item.bottlesPerUnit} unidades</span>
                            <div class="cart-item-bottom">
                                <div class="cart-item-qty">
                                    <div class="cart-item-qty-btn decrease" data-key="${item.key}">-</div>
                                    <span class="cart-item-qty-val">${item.quantity}</span>
                                    <div class="cart-item-qty-btn increase" data-key="${item.key}">+</div>
                                </div>
                                <div class="cart-item-price-box">${formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        </div>
                        <span class="cart-item-remove" data-key="${item.key}">&times;</span>
                    `;
                    
                    // Agregar listeners para interactividad dentro del carrito
                    itemEl.querySelector('.decrease').addEventListener('click', () => {
                        changeCartItemQty(item.key, -1);
                    });
                    itemEl.querySelector('.increase').addEventListener('click', () => {
                        changeCartItemQty(item.key, 1);
                    });
                    itemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
                        removeCartItem(item.key);
                    });
                    
                    cartItemsContainer.appendChild(itemEl);
                });
            }
        }
        
        // Calcular subtotales
        const subtotalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        // Descuentos
        let discountValue = 0;
        if (promoDiscountPct > 0) {
            discountValue = subtotalValue * (promoDiscountPct / 100);
        }
        
        // Envío Gratis
        if (subtotalValue > db.freeShippingMin && subtotalValue > 0) {
            shippingCost = 0;
            const shippingResult = document.getElementById('shipping-result');
            if (shippingResult && zipCodeSearched) {
                shippingResult.innerHTML = `Envío gratis disponible para tu compra.`;
            }
        }
        
        const finalTotal = Math.max(0, subtotalValue - discountValue + shippingCost);
        
        // Escribir en DOM
        if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotalValue);
        if (cartDiscount) {
            cartDiscount.textContent = discountValue > 0 ? `-${formatCurrency(discountValue)}` : '$0';
            cartDiscount.parentElement.style.display = discountValue > 0 ? 'flex' : 'none';
        }
        if (cartShipping) {
            cartShipping.textContent = shippingCost > 0 ? formatCurrency(shippingCost) : (subtotalValue > 0 ? 'Gratis' : '$0');
        }
        if (cartTotal) cartTotal.textContent = formatCurrency(finalTotal);
        
        // Código promocional input state
        if (promoCodeApplied) {
            if (inputPromoCode) inputPromoCode.value = promoCodeApplied;
            if (promoMessage) {
                promoMessage.className = 'discount-message success';
                promoMessage.textContent = `Cupón ${promoCodeApplied} aplicado (${promoDiscountPct}% OFF)`;
            }
        }
    };

    const changeCartItemQty = (key, delta) => {
        const item = cart.find(i => i.key === key);
        if (!item) return;
        
        const nextQty = item.quantity + delta;
        if (nextQty <= 0) {
            removeCartItem(key);
            return;
        }
        
        // Validar stock total en botellas
        const currentTotalBottlesInCart = cart.reduce((acc, i) => {
            if (i.key === key) return acc + (nextQty * i.bottlesPerUnit);
            return acc + (i.quantity * i.bottlesPerUnit);
        }, 0);
        
        if (currentTotalBottlesInCart <= db.stock) {
            item.quantity = nextQty;
            saveCart();
        } else {
            alert(`No hay stock suficiente para agregar más botellas. Stock disponible: ${db.stock} botellas.`);
        }
    };

    const removeCartItem = (key) => {
        cart = cart.filter(item => item.key !== key);
        saveCart();
    };

    const addProductToCart = (presentation, quantity) => {
        // Validar stock antes
        const totalRequestedBottles = quantity * presentation.bottles;
        const totalBottlesInCart = cart.reduce((acc, item) => acc + (item.quantity * item.bottlesPerUnit), 0);
        
        if ((totalBottlesInCart + totalRequestedBottles) > db.stock) {
            alert(`Stock insuficiente. Solo quedan ${db.stock} botellas y ya tenés unidades en el carrito.`);
            return false;
        }
        
        // Revisar si ya existe la presentación en el carrito
        const existing = cart.find(item => item.key === presentation.key);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                key: presentation.key,
                name: presentation.name,
                price: presentation.price,
                bottlesPerUnit: presentation.bottles,
                quantity: quantity
            });
        }
        
        saveCart();
        trackEvent('Add To Cart', { presentation: presentation.name, quantity });
        return true;
    };

    // Click "Agregar al carrito" en sección compra
    const btnAddCart = document.getElementById('btn-add-cart');
    if (btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            const qty = parseInt(buyQtyInput.value);
            if (addProductToCart(selectedPresentation, qty)) {
                openCartDrawerFn();
            }
        });
    }

    // Click "Comprar ahora" en sección compra
    const btnBuyNow = document.getElementById('btn-buy-now');
    if (btnBuyNow) {
        btnBuyNow.addEventListener('click', () => {
            const qty = parseInt(buyQtyInput.value);
            if (addProductToCart(selectedPresentation, qty)) {
                openCartDrawerFn();
                // Abrir checkout directo
                setTimeout(() => {
                    openCheckoutModalFn();
                }, 400);
            }
        });
    }

    // Drawer opens/closes
    const openCartDrawerFn = () => {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Evitar scroll
    };

    const closeCartDrawerFn = () => {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    cartIconBtn.addEventListener('click', openCartDrawerFn);
    closeCart.addEventListener('click', closeCartDrawerFn);
    cartOverlay.addEventListener('click', closeCartDrawerFn);
    
    const btnContinueShopping = document.getElementById('continue-shopping');
    if (btnContinueShopping) btnContinueShopping.addEventListener('click', closeCartDrawerFn);

    // --------------------------------------------------
    // G. Cupón de Descuento
    // --------------------------------------------------
    if (btnApplyPromo) {
        btnApplyPromo.addEventListener('click', () => {
            const code = inputPromoCode.value.trim().toUpperCase();
            
            if (code === '') {
                promoMessage.className = 'discount-message error';
                promoMessage.textContent = 'Ingresá un código válido.';
                return;
            }
            
            if (code === 'AMIGOS10') {
                promoCodeApplied = 'AMIGOS10';
                promoDiscountPct = 10;
                promoMessage.className = 'discount-message success';
                promoMessage.textContent = '¡Descuento 10% OFF aplicado con éxito!';
                saveCart();
            } else {
                promoMessage.className = 'discount-message error';
                promoMessage.textContent = 'Cupón inválido o vencido.';
            }
        });
    }

    // --------------------------------------------------
    // H. Calculador de Envío
    // --------------------------------------------------
    const btnCalcShipping = document.getElementById('calc-shipping-btn');
    const inputZipCode = document.getElementById('shipping-zip');
    const shippingResult = document.getElementById('shipping-result');

    if (btnCalcShipping && inputZipCode && shippingResult) {
        btnCalcShipping.addEventListener('click', () => {
            const zip = inputZipCode.value.trim();
            if (zip === '') {
                shippingResult.innerHTML = '<span style="color:#f44336;">Ingresá tu código postal.</span>';
                return;
            }
            
            zipCodeSearched = zip;
            const subtotalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            
            // Si el carrito califica para envío gratis
            if (subtotalValue > db.freeShippingMin) {
                shippingCost = 0;
                shippingResult.innerHTML = '¡Tu compra califica para Envío Gratis!';
                saveCart();
                return;
            }
            
            // Calcular según prefijo CP argentino
            const firstDigit = zip.charAt(0);
            
            if (firstDigit === '5' || zip.startsWith('55') || zip.startsWith('56')) {
                shippingCost = db.shippingRates.mendoza;
                shippingResult.innerHTML = `Envío local (Mendoza): ${formatCurrency(shippingCost)}. Entrega en 24-48 hs.`;
            } else if (firstDigit === '1' || firstDigit === 'B' || zip.startsWith('10') || zip.startsWith('14')) {
                shippingCost = db.shippingRates.buenosAires;
                shippingResult.innerHTML = `Envío CABA / GBA: ${formatCurrency(shippingCost)}. Entrega en 3-5 días hábiles.`;
            } else {
                shippingCost = db.shippingRates.resto;
                shippingResult.innerHTML = `Envío Resto de Argentina: ${formatCurrency(shippingCost)}. Entrega en 5-7 días hábiles.`;
            }
            
            saveCart();
        });
    }

    // --------------------------------------------------
    // I. Checkout Flow
    // --------------------------------------------------
    const openCheckoutModalFn = () => {
        if (cart.length === 0) {
            alert('Agregá productos al carrito antes de finalizar la compra.');
            return;
        }
        closeCartDrawerFn();
        checkoutModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Renderizar el total en el checkout
        updateCheckoutTotalSummary();
    };

    const closeCheckoutModalFn = () => {
        checkoutModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Resetear checkout al paso 1
        currentCheckoutStep = 1;
        showCheckoutStep(1);
    };

    btnCheckout.addEventListener('click', openCheckoutModalFn);
    closeCheckout.addEventListener('click', closeCheckoutModalFn);

    // Navegar pasos
    let currentCheckoutStep = 1;
    const checkoutStepPanels = document.querySelectorAll('.checkout-step-panel');
    const checkoutStepNavItems = document.querySelectorAll('.checkout-step-nav-item');
    const btnCheckoutPrev = document.getElementById('checkout-prev');
    const btnCheckoutNext = document.getElementById('checkout-next');

    const showCheckoutStep = (step) => {
        checkoutStepPanels.forEach(p => p.classList.remove('active'));
        checkoutStepNavItems.forEach(n => n.classList.remove('active'));
        
        document.getElementById(`step-panel-${step}`).classList.add('active');
        document.getElementById(`step-nav-${step}`).classList.add('active');
        
        currentCheckoutStep = step;
        
        // Controlar botones footer
        if (step === 1) {
            btnCheckoutPrev.style.display = 'none';
            btnCheckoutNext.textContent = 'Continuar a pago';
        } else if (step === 2) {
            btnCheckoutPrev.style.display = 'block';
            btnCheckoutNext.textContent = 'Confirmar y pagar';
        } else if (step === 3) {
            // Éxito - Ocultar botones e inicializar vista final
            btnCheckoutPrev.style.display = 'none';
            btnCheckoutNext.style.display = 'none';
            closeCheckout.style.display = 'none'; // Impedir cerrar de golpe sin clickear botón final
        }
    };

    const validateStep1 = () => {
        const name = document.getElementById('chk-name').value.trim();
        const email = document.getElementById('chk-email').value.trim();
        const phone = document.getElementById('chk-phone').value.trim();
        const address = document.getElementById('chk-address').value.trim();
        const city = document.getElementById('chk-city').value.trim();
        const zip = document.getElementById('chk-zip').value.trim();
        
        if (!name || !email || !phone || !address || !city || !zip) {
            alert('Por favor complete todos los datos requeridos.');
            return false;
        }
        
        // Simple validación de mail
        if (!email.includes('@') || !email.includes('.')) {
            alert('Por favor ingrese un correo electrónico válido.');
            return false;
        }
        
        return true;
    };

    // Selección de método de pago
    let selectedPaymentMethod = 'mercadopago';
    const paymentCards = document.querySelectorAll('.payment-method-card');
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPaymentMethod = card.dataset.method;
        });
    });

    const updateCheckoutTotalSummary = () => {
        const subtotalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        let discountValue = 0;
        if (promoDiscountPct > 0) {
            discountValue = subtotalValue * (promoDiscountPct / 100);
        }
        const finalTotal = Math.max(0, subtotalValue - discountValue + shippingCost);
        
        const summaryBox = document.getElementById('checkout-order-summary');
        if (summaryBox) {
            let itemsHtml = cart.map(item => `
                <div class="order-summary-row">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
            `).join('');
            
            summaryBox.innerHTML = `
                <h5>Resumen de tu pedido</h5>
                <div style="margin-top: 16px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 12px; margin-bottom: 12px;">
                    ${itemsHtml}
                </div>
                <div class="order-summary-row">
                    <span>Subtotal</span>
                    <span>${formatCurrency(subtotalValue)}</span>
                </div>
                ${discountValue > 0 ? `
                <div class="order-summary-row text-sunset">
                    <span>Descuento (${promoCodeApplied})</span>
                    <span>-${formatCurrency(discountValue)}</span>
                </div>` : ''}
                <div class="order-summary-row">
                    <span>Costo de envío</span>
                    <span>${shippingCost > 0 ? formatCurrency(shippingCost) : 'Gratis'}</span>
                </div>
                <div class="order-summary-row total">
                    <span>Total</span>
                    <span>${formatCurrency(finalTotal)}</span>
                </div>
            `;
        }
    };

    btnCheckoutNext.addEventListener('click', () => {
        if (currentCheckoutStep === 1) {
            if (validateStep1()) {
                // Registrar analítica
                trackEvent('Checkout Progress', { step: 1 });
                showCheckoutStep(2);
            }
        } else if (currentCheckoutStep === 2) {
            processPurchase();
        }
    });

    btnCheckoutPrev.addEventListener('click', () => {
        if (currentCheckoutStep === 2) {
            showCheckoutStep(1);
        }
    });

    const processPurchase = () => {
        btnCheckoutNext.disabled = true;
        btnCheckoutNext.textContent = 'Procesando...';
        
        // Simular llamada a pasarela de pagos / guardado en DB local
        setTimeout(() => {
            const customerName = document.getElementById('chk-name').value.trim();
            const customerEmail = document.getElementById('chk-email').value.trim();
            const customerPhone = document.getElementById('chk-phone').value.trim();
            const customerAddress = document.getElementById('chk-address').value.trim();
            const customerProvince = document.getElementById('chk-province').value;
            const customerCity = document.getElementById('chk-city').value.trim();
            const customerZip = document.getElementById('chk-zip').value.trim();
            
            const subtotalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            let discountValue = 0;
            if (promoDiscountPct > 0) {
                discountValue = subtotalValue * (promoDiscountPct / 100);
            }
            const finalTotal = Math.max(0, subtotalValue - discountValue + shippingCost);
            
            // Generar número de pedido
            const orderNum = 'EA-' + Math.floor(100000 + Math.random() * 900000);
            
            // Estructura de la orden
            const newOrder = {
                id: orderNum,
                date: new Date().toISOString(),
                customer: {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    address: `${customerAddress}, ${customerCity}, ${customerProvince} (CP: ${customerZip})`
                },
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    format: `${item.bottlesPerUnit} botellas`,
                    bottlesTotal: item.quantity * item.bottlesPerUnit,
                    price: item.price
                })),
                subtotal: subtotalValue,
                discount: discountValue,
                shipping: shippingCost,
                total: finalTotal,
                paymentMethod: selectedPaymentMethod,
                status: 'Pendiente'
            };
            
            // Descontar del stock global
            const totalBottlesSold = newOrder.items.reduce((acc, i) => acc + i.bottlesTotal, 0);
            db.stock = Math.max(0, db.stock - totalBottlesSold);
            
            // Obtener órdenes previas y guardar
            const orders = JSON.parse(localStorage.getItem('el_arrebato_orders')) || [];
            orders.unshift(newOrder);
            localStorage.setItem('el_arrebato_orders', JSON.stringify(orders));
            saveDB(db); // Persistir el stock descontado
            
            // Renderizar confirmación de éxito
            const successPanel = document.getElementById('success-summary-box');
            if (successPanel) {
                let itemsHtml = cart.map(item => `<div>${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}</div>`).join('');
                
                successPanel.innerHTML = `
                    <div style="font-weight:600; margin-bottom:12px; color:var(--color-gold);">Pedido: ${orderNum}</div>
                    <div style="font-size:0.85rem; border-bottom:1px solid var(--color-border-light); padding-bottom:12px; margin-bottom:12px;">
                        ${itemsHtml}
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                        <span>Costo de Envío:</span>
                        <span>${shippingCost > 0 ? formatCurrency(shippingCost) : 'Gratis'}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-weight:600; font-size:1.1rem; color:var(--color-gold); margin-top:8px;">
                        <span>Total abonado:</span>
                        <span>${formatCurrency(finalTotal)}</span>
                    </div>
                `;
            }
            
            // Mostrar instrucciones según método de pago
            const paymentInstructions = document.getElementById('payment-instructions');
            if (paymentInstructions) {
                if (selectedPaymentMethod === 'transfer') {
                    paymentInstructions.innerHTML = `
                        <div style="background:rgba(198, 161, 91, 0.05); border:1px solid var(--color-border); padding:16px; border-radius: var(--radius-md); margin-top:20px; text-align:left; font-size:0.85rem;">
                            <strong style="color:var(--color-gold); display:block; margin-bottom:8px;">Instrucciones para Transferencia Bancaria:</strong>
                            CBU: 0170098720000006789123<br>
                            Alias: ELARREBATO.MALBEC<br>
                            Banco: Banco Galicia<br>
                            Titular: Familia Arreguez<br>
                            <em>Por favor, enviá el comprobante de transferencia al WhatsApp de atención al cliente para despachar tu pedido.</em>
                        </div>
                    `;
                } else {
                    paymentInstructions.innerHTML = `
                        <div style="background:rgba(76, 175, 80, 0.05); border:1px solid rgba(76,175,80,0.2); padding:16px; border-radius: var(--radius-md); margin-top:20px; text-align:left; font-size:0.85rem;">
                            <strong style="color:#4CAF50; display:block; margin-bottom:8px;">Pago procesado de forma segura:</strong>
                            El cobro se ha registrado a través de la pasarela de pagos integrada de Mercado Pago. Te llegará la confirmación y ticket fiscal por email.
                        </div>
                    `;
                }
            }
            
            // Eventos analíticos
            trackEvent('Purchase', { orderId: orderNum, total: finalTotal, method: selectedPaymentMethod });
            
            // Limpiar Carrito
            cart = [];
            promoCodeApplied = '';
            promoDiscountPct = 0;
            shippingCost = 0;
            zipCodeSearched = '';
            localStorage.removeItem('el_arrebato_cart');
            localStorage.removeItem('applied_promo_code');
            localStorage.removeItem('applied_promo_discount_pct');
            
            // Actualizar interfaz principal de la tienda (nuevo stock y carrito vacío)
            updateCartUI();
            updateSelectedPresentationInfo();
            renderDynamicContent();
            
            btnCheckoutNext.disabled = false;
            
            // Mostrar paso final
            showCheckoutStep(3);
        }, 1500);
    };
    
    // Botón final del checkout "Volver a la tienda"
    const btnFinishCheckout = document.getElementById('checkout-finish-btn');
    if (btnFinishCheckout) {
        btnFinishCheckout.addEventListener('click', () => {
            closeCheckoutModalFn();
            // Restaurar botones de cerrado
            closeCheckout.style.display = 'block';
            btnCheckoutNext.style.display = 'block';
        });
    }

    // --------------------------------------------------
    // J. Galería e Interacción Zoom
    // --------------------------------------------------
    const mainGalleryImg = document.getElementById('main-gallery-img');
    const thumbBtns = document.querySelectorAll('.thumb-btn');

    if (mainGalleryImg && thumbBtns.length > 0) {
        thumbBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                thumbBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const type = btn.dataset.type;
                if (type === 'frente') {
                    mainGalleryImg.src = 'public/images/arrebato_frente.png';
                } else if (type === 'perspectiva') {
                    mainGalleryImg.src = 'public/images/arrebato_perspectiva.png';
                } else if (type === 'contra') {
                    mainGalleryImg.src = 'public/images/arrebato_contraetiqueta.png';
                }
            });
        });
        
        // Efecto Zoom premium
        const galleryMain = document.querySelector('.gallery-main');
        if (galleryMain) {
            galleryMain.addEventListener('mousemove', (e) => {
                const rect = galleryMain.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within element
                const y = e.clientY - rect.top;  // y position within element
                
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                
                mainGalleryImg.style.transformOrigin = `${percentX}% ${percentY}%`;
                mainGalleryImg.style.transform = 'scale(1.8)';
            });
            
            galleryMain.addEventListener('mouseleave', () => {
                mainGalleryImg.style.transform = 'scale(1)';
                mainGalleryImg.style.transformOrigin = 'center center';
            });
        }
    }

    // --------------------------------------------------
    // K. Pentagono Interactivo de la Amistad
    // --------------------------------------------------
    const pentagonNodes = document.querySelectorAll('.pentagon-node');
    const pentagonLabels = document.querySelectorAll('.pentagon-label-text');
    const pentagonTitle = document.getElementById('pentagon-info-title');
    const pentagonDesc = document.getElementById('pentagon-info-desc');

    const pentagonDetails = {
        'lealtad': {
            title: 'Lealtad',
            desc: 'La firmeza de estar presente en cada paso. Un pacto tácito que se sostiene a lo largo del tiempo, como los viñedos viejos del Valle de Uco.'
        },
        'risas': {
            title: 'Risas',
            desc: 'El ingrediente que aligera la vida. Esas carcajadas compartidas que resuenan en la bodega de recuerdos y le dan chispa al encuentro.'
        },
        'anecdotas': {
            title: 'Anécdotas',
            desc: 'Historias repetidas que nunca cansan. Cada botella abierta es un pretexto para reescribir y recordar vivencias que nos formaron.'
        },
        'union': {
            title: 'Unión',
            desc: 'La fuerza de la comunidad. El Arrebato reúne a las personas, tendiendo puentes de complicidad y creando lazos irrompibles.'
        },
        'confianza': {
            title: 'Confianza',
            desc: 'La tranquilidad de poder ser uno mismo. Saber que el otro te escucha, te cuida y brinda con vos con total transparencia y honestidad.'
        }
    };

    const activatePentagonConcept = (conceptKey) => {
        if (!conceptKey || !pentagonDetails[conceptKey]) return;
        
        // Actualizar tarjeta visual
        if (pentagonTitle && pentagonDesc) {
            pentagonTitle.textContent = pentagonDetails[conceptKey].title;
            pentagonDesc.textContent = pentagonDetails[conceptKey].desc;
        }
        
        // Estilo de los nodos y textos
        pentagonNodes.forEach(node => {
            if (node.dataset.concept === conceptKey) {
                node.setAttribute('r', '8');
                node.style.fill = 'var(--color-sunset)';
            } else {
                node.setAttribute('r', '6');
                node.style.fill = 'var(--color-bg-dark)';
            }
        });
        
        pentagonLabels.forEach(label => {
            if (label.dataset.concept === conceptKey) {
                label.style.fill = 'var(--color-gold)';
                label.style.fontWeight = 'bold';
            } else {
                label.style.fill = 'var(--color-gray-warm)';
                label.style.fontWeight = '500';
            }
        });
    };

    pentagonNodes.forEach(node => {
        node.addEventListener('click', () => {
            activatePentagonConcept(node.dataset.concept);
        });
        node.addEventListener('mouseenter', () => {
            activatePentagonConcept(node.dataset.concept);
        });
    });

    pentagonLabels.forEach(label => {
        label.addEventListener('click', () => {
            activatePentagonConcept(label.dataset.concept);
        });
        label.addEventListener('mouseenter', () => {
            activatePentagonConcept(label.dataset.concept);
        });
    });

    // Activar por defecto
    activatePentagonConcept('confianza');

    // --------------------------------------------------
    // L. Recomendador / Asistente de Ocasión (Micro-Wizard)
    // --------------------------------------------------
    const btnRecommendOpen = document.getElementById('recommend-open-btn');
    const recommendModal = document.getElementById('recommend-modal');
    const closeRecommend = document.getElementById('close-recommend');
    const recommendQuestion = document.getElementById('recommend-question');
    const recommendOptionsBox = document.getElementById('recommend-options');

    if (btnRecommendOpen && recommendModal && closeRecommend) {
        btnRecommendOpen.addEventListener('click', () => {
            recommendModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            startRecommendWizard();
        });
        
        closeRecommend.addEventListener('click', () => {
            recommendModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    const startRecommendWizard = () => {
        recommendQuestion.textContent = '¿Para qué tipo de ocasión estás buscando el vino?';
        recommendOptionsBox.innerHTML = `
            <div class="recommend-option-btn" data-val="cena">Una cena íntima o cita</div>
            <div class="recommend-option-btn" data-val="regalo">Para regalar a un ser querido</div>
            <div class="recommend-option-btn" data-val="asado">Un asado o reunión con amigos (5-6 personas)</div>
            <div class="recommend-option-btn" data-val="evento">Una celebración grande o stock personal</div>
        `;
        
        document.querySelectorAll('.recommend-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.val;
                showRecommendResult(choice);
            });
        });
    };

    const showRecommendResult = (choice) => {
        let titleResult = '';
        let descResult = '';
        let targetKey = 'caja6'; // Por defecto caja de 6
        
        if (choice === 'cena') {
            titleResult = 'Nuestra recomendación: 1 Botella (750 ml)';
            descResult = 'Ideal para coronar una cena especial de a dos. Es la medida perfecta para disfrutar de una copa de El Arrebato Malbec y descubrir sus elegantes aromas y textura sedosa.';
            targetKey = 'bottle1';
        } else if (choice === 'regalo') {
            titleResult = 'Nuestra recomendación: Pack de 3 Botellas';
            descResult = 'Un obsequio elegante y distinguido. Permite al homenajeado guardar botellas para diferentes momentos y quedar sumamente bien con una presentación premium de colección.';
            targetKey = 'pack3';
        } else if (choice === 'asado') {
            titleResult = 'Nuestra recomendación: Caja de 6 Botellas';
            descResult = 'El núcleo de nuestro concepto. Diseñada exactamente para el "Pentágono de los amigos". Asegura que nadie se quede con la copa vacía en esas charlas que se extienden hasta tarde.';
            targetKey = 'caja6';
        } else if (choice === 'evento') {
            titleResult = 'Nuestra recomendación: Caja de 12 Botellas';
            descResult = 'La mejor opción para coleccionistas o grandes celebraciones. Con esta presentación, garantizás un abastecimiento premium y obtenés el máximo descuento del 15% de la bodega.';
            targetKey = 'caja12';
        }
        
        recommendQuestion.innerHTML = `<span class="text-gold" style="font-family:var(--font-serif); font-size:1.5rem; display:block; margin-bottom:12px;">${titleResult}</span>`;
        recommendOptionsBox.innerHTML = `
            <p style="color:var(--color-gray-warm); font-size:0.95rem; margin-bottom:24px; line-height:1.6; text-align:left;">${descResult}</p>
            <button class="btn btn-solid" id="recommend-action-btn" style="width:100%;">Seleccionar presentación y comprar</button>
            <div style="margin-top:16px;"><span class="btn-ghost" id="recommend-restart-btn" style="font-size:0.75rem; cursor:pointer;">Volver a empezar</span></div>
        `;
        
        document.getElementById('recommend-action-btn').addEventListener('click', () => {
            recommendModal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Desplazar a la sección de compra
            document.getElementById('comprar').scrollIntoView({ behavior: 'smooth' });
            
            // Activar la presentación recomendada en el selector
            setTimeout(() => {
                const optEl = document.querySelector(`.presentation-option[data-key="${targetKey}"]`);
                if (optEl) optEl.click();
            }, 800);
        });
        
        document.getElementById('recommend-restart-btn').addEventListener('click', startRecommendWizard);
    };

    // --------------------------------------------------
    // M. Carrusel de Testimonios
    // --------------------------------------------------
    const renderTestimonials = () => {
        const track = document.getElementById('testimonios-track');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!track || !dotsContainer) return;
        
        track.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        const activeTestimonials = db.testimonials.filter(t => t.active);
        
        if (activeTestimonials.length === 0) {
            track.innerHTML = `<div class="testimonio-slide"><p class="testimonio-text">Las reseñas de clientes aparecerán aquí próximamente.</p></div>`;
            return;
        }
        
        activeTestimonials.forEach((test, idx) => {
            const starsHtml = '★'.repeat(test.stars) + '☆'.repeat(5 - test.stars);
            const verifiedLabel = test.verified ? `<span class="verified-badge">Compra Verificada</span>` : '';
            
            const slide = document.createElement('div');
            slide.className = 'testimonio-slide';
            slide.innerHTML = `
                <div class="testimonio-stars">${starsHtml}</div>
                <p class="testimonio-text">"${test.text}"</p>
                <div class="testimonio-author">${test.name} ${verifiedLabel}</div>
            `;
            track.appendChild(slide);
            
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
            dot.dataset.index = idx;
            dot.addEventListener('click', () => {
                goToSlide(idx);
            });
            dotsContainer.appendChild(dot);
        });
        
        initTestimonialsCarousel(activeTestimonials.length);
    };

    let currentSlide = 0;
    let carouselInterval = null;

    const initTestimonialsCarousel = (slidesCount) => {
        const track = document.getElementById('testimonios-track');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        if (slidesCount <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        } else {
            if (prevBtn) prevBtn.style.display = 'flex';
            if (nextBtn) nextBtn.style.display = 'flex';
        }
        
        currentSlide = 0;
        if (track) track.style.transform = `translateX(0)`;
        
        const goToSlide = (idx) => {
            currentSlide = idx;
            track.style.transform = `translateX(-${idx * 100}%)`;
            
            // Actualizar dots
            document.querySelectorAll('.carousel-dot').forEach((dot, dIdx) => {
                dot.classList.toggle('active', dIdx === idx);
            });
            
            resetAutoplay();
        };
        
        const nextSlide = () => {
            let next = (currentSlide + 1) % slidesCount;
            goToSlide(next);
        };
        
        const prevSlide = () => {
            let prev = (currentSlide - 1 + slidesCount) % slidesCount;
            goToSlide(prev);
        };
        
        if (prevBtn && nextBtn) {
            prevBtn.onclick = prevSlide;
            nextBtn.onclick = nextSlide;
        }
        
        const startAutoplay = () => {
            carouselInterval = setInterval(nextSlide, 8000);
        };
        
        const resetAutoplay = () => {
            clearInterval(carouselInterval);
            startAutoplay();
        };
        
        // Exportar a ámbito de eventos de dots
        window.goToSlide = goToSlide;
        
        startAutoplay();
    };

    // --------------------------------------------------
    // N. Preguntas Frecuentes (Acordeones)
    // --------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question-btn');
        const answer = item.querySelector('.faq-answer');
        
        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Cerrar otros abiertos
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --------------------------------------------------
    // O. Formularios & Captura de Datos
    // --------------------------------------------------
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm && newsletterSuccess) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('news-name').value.trim();
            const email = document.getElementById('news-email').value.trim();
            const birthDate = document.getElementById('news-dob').value;
            const consent = document.getElementById('news-consent').checked;
            
            if (!name || !email || !consent) {
                alert('Por favor complete los campos requeridos y acepte los términos de comunicación.');
                return;
            }
            
            // Simular guardado
            const signups = JSON.parse(localStorage.getItem('el_arrebato_newsletter')) || [];
            signups.push({ name, email, dob: birthDate, date: new Date().toISOString() });
            localStorage.setItem('el_arrebato_newsletter', JSON.stringify(signups));
            
            trackEvent('Newsletter Signup', { email });
            
            // Éxito UI
            newsletterForm.style.display = 'none';
            newsletterSuccess.style.display = 'block';
        });
    }

    // Contacto Form
    const contactoForm = document.getElementById('contacto-form');
    const contactoSuccess = document.getElementById('contacto-success');

    if (contactoForm) {
        contactoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('ct-name').value.trim();
            const company = document.getElementById('ct-company').value.trim();
            const city = document.getElementById('ct-city').value.trim();
            const whatsapp = document.getElementById('ct-whatsapp').value.trim();
            const email = document.getElementById('ct-email').value.trim();
            const type = document.getElementById('ct-type').value;
            const message = document.getElementById('ct-message').value.trim();
            
            if (!name || !email || !message) {
                alert('Por favor complete los campos Nombre, Email y Mensaje.');
                return;
            }
            
            // Guardar consulta
            const inquiries = JSON.parse(localStorage.getItem('el_arrebato_inquiries')) || [];
            inquiries.push({
                name, company, city, whatsapp, email, type, message, date: new Date().toISOString()
            });
            localStorage.setItem('el_arrebato_inquiries', JSON.stringify(inquiries));
            
            trackEvent('Contact Form Submission', { type });
            
            // Éxito UI
            contactoForm.reset();
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto con vos a la brevedad.');
        });
    }

    // --------------------------------------------------
    // P. Botón flotante WhatsApp Click Tracking
    // --------------------------------------------------
    const waFloat = document.getElementById('wa-float');
    if (waFloat) {
        waFloat.addEventListener('click', () => {
            trackEvent('WhatsApp Chat Click', { location: 'floating_button' });
        });
    }

    // --------------------------------------------------
    // Q. Helpers de Analítica & Tracking (Simulados)
    // --------------------------------------------------
    const trackEvent = (eventName, params = {}) => {
        console.log(`[Marketing Track Event] ${eventName}:`, params);
        
        // Agregar logs a localStorage para que el admin pueda ver las métricas básicas!
        const analytics = JSON.parse(localStorage.getItem('el_arrebato_analytics')) || [];
        analytics.push({
            event: eventName,
            params: params,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('el_arrebato_analytics', JSON.stringify(analytics));
        
        // Aquí se integrarían códigos reales:
        // fbq('track', eventName, params); // Meta Pixel
        // gtag('event', eventName, params); // Google Analytics 4
    };

    // Inicializar visualización
    renderDynamicContent();
    saveCart(); // Inicializa el carrito
    
    // Escuchar cambios de almacenamiento de otras pestañas (como Admin) para sincronizar inmediatamente
    window.addEventListener('storage', (e) => {
        if (e.key === 'el_arrebato_db') {
            renderDynamicContent();
        }
    });
});
