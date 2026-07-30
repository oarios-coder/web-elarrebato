/* --------------------------------------------------
   EL ARREBATO - Premium Malbec 2025
   Lógica del Panel de Administración (JavaScript Vanilla)
   -------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // A. Autenticación Sencilla
    // --------------------------------------------------
    const authWrapper = document.getElementById('admin-auth-wrapper');
    const adminDashboard = document.getElementById('admin-dashboard');
    const pinInput = document.getElementById('admin-pin');
    const authBtn = document.getElementById('admin-auth-btn');
    const authError = document.getElementById('admin-auth-error');

    // Clave de acceso administrativa
    const ACCESS_PIN = 'arrebato2025';

    const checkSessionAuth = () => {
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            if (authWrapper) authWrapper.style.display = 'none';
            if (adminDashboard) adminDashboard.style.display = 'block';
            initAdminDashboard();
        } else {
            if (authWrapper) authWrapper.style.display = 'flex';
            if (adminDashboard) adminDashboard.style.display = 'none';
        }
    };

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (pinInput.value === ACCESS_PIN) {
                sessionStorage.setItem('admin_authenticated', 'true');
                authWrapper.style.display = 'none';
                adminDashboard.style.display = 'block';
                authError.textContent = '';
                initAdminDashboard();
            } else {
                authError.textContent = 'Código de acceso incorrecto.';
            }
        });
        
        pinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') authBtn.click();
        });
    }

    checkSessionAuth();

    // --------------------------------------------------
    // B. Inicialización del Panel
    // --------------------------------------------------
    function initAdminDashboard() {
        // Cargar base de datos local
        const getDB = () => JSON.parse(localStorage.getItem('el_arrebato_db'));
        const saveDB = (data) => localStorage.setItem('el_arrebato_db', JSON.stringify(data));
        let db = getDB();

        // Control de Pestañas (Tabs)
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        const tabPanels = document.querySelectorAll('.admin-tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const target = btn.dataset.tab;
                document.getElementById(`tab-${target}`).classList.add('active');
                
                // Cargar datos específicos si es necesario
                if (target === 'orders') renderOrdersTable();
                if (target === 'inquiries') renderInquiriesTable();
                if (target === 'news') renderNewsletterTable();
                if (target === 'testimonials') renderTestimonialsEditor();
                if (target === 'analytics') renderAnalyticsOverview();
            });
        });

        // 1. Cargar Datos en Formularios de Parámetros (Pestaña Ajustes)
        const loadSettingsFields = () => {
            db = getDB();
            
            // Precios y Stock
            document.getElementById('adm-price').value = db.priceBottle;
            document.getElementById('adm-stock').value = db.stock;
            document.getElementById('adm-free-shipping').value = db.freeShippingMin;
            document.getElementById('adm-ship-mza').value = db.shippingRates.mendoza;
            document.getElementById('adm-ship-ba').value = db.shippingRates.buenosAires;
            document.getElementById('adm-ship-resto').value = db.shippingRates.resto;
            
            // Descuentos de Packs
            document.getElementById('adm-disc-pack3').value = db.discountPacks.pack3;
            document.getElementById('adm-disc-caja6').value = db.discountPacks.caja6;
            document.getElementById('adm-disc-caja12').value = db.discountPacks.caja12;
            
            // Contenidos Ficha Técnica & Cata
            document.getElementById('adm-tasting').value = db.tastingNotes;
            
            // Historia
            document.getElementById('adm-history').value = db.brandHistory;
            
            // Identidad Artística
            document.getElementById('adm-art-author').value = db.artAuthor;
            document.getElementById('adm-art-inspiration').value = db.artInspiration;
            document.getElementById('adm-art-woman').value = db.artWomanMeaning;
            document.getElementById('adm-art-pentagon').value = db.artPentagonMeaning;
            
            // Datos de Contacto y Fiscal
            document.getElementById('adm-phone').value = db.cellphone;
            document.getElementById('adm-email').value = db.email;
            document.getElementById('adm-address').value = db.address;
            document.getElementById('adm-razon').value = db.razonSocial;
            document.getElementById('adm-fiscal').value = db.fiscalInfo;
        };

        // Guardar Cambios Ajustes
        const formSettings = document.getElementById('admin-settings-form');
        if (formSettings) {
            formSettings.addEventListener('submit', (e) => {
                e.preventDefault();
                
                db.priceBottle = parseFloat(document.getElementById('adm-price').value);
                db.stock = parseInt(document.getElementById('adm-stock').value);
                db.freeShippingMin = parseFloat(document.getElementById('adm-free-shipping').value);
                db.shippingRates.mendoza = parseFloat(document.getElementById('adm-ship-mza').value);
                db.shippingRates.buenosAires = parseFloat(document.getElementById('adm-ship-ba').value);
                db.shippingRates.resto = parseFloat(document.getElementById('adm-ship-resto').value);
                
                db.discountPacks.pack3 = parseFloat(document.getElementById('adm-disc-pack3').value);
                db.discountPacks.caja6 = parseFloat(document.getElementById('adm-disc-caja6').value);
                db.discountPacks.caja12 = parseFloat(document.getElementById('adm-disc-caja12').value);
                
                db.tastingNotes = document.getElementById('adm-tasting').value.trim();
                db.brandHistory = document.getElementById('adm-history').value.trim();
                
                db.artAuthor = document.getElementById('adm-art-author').value.trim();
                db.artInspiration = document.getElementById('adm-art-inspiration').value.trim();
                db.artWomanMeaning = document.getElementById('adm-art-woman').value.trim();
                db.artPentagonMeaning = document.getElementById('adm-art-pentagon').value.trim();
                
                db.cellphone = document.getElementById('adm-phone').value.trim();
                db.email = document.getElementById('adm-email').value.trim();
                db.address = document.getElementById('adm-address').value.trim();
                db.razonSocial = document.getElementById('adm-razon').value.trim();
                db.fiscalInfo = document.getElementById('adm-fiscal').value.trim();
                
                saveDB(db);
                alert('¡Configuraciones guardadas y sincronizadas con éxito!');
            });
        }

        // 2. Renderizar Tabla de Pedidos (Orders)
        const renderOrdersTable = () => {
            const tableBody = document.getElementById('adm-orders-table');
            if (!tableBody) return;
            
            const orders = JSON.parse(localStorage.getItem('el_arrebato_orders')) || [];
            
            if (orders.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No se registraron pedidos aún.</td></tr>`;
                return;
            }
            
            tableBody.innerHTML = '';
            orders.forEach((order) => {
                const dateFormatted = new Date(order.date).toLocaleString('es-AR');
                const totalFormatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(order.total);
                
                const itemsList = order.items.map(i => `${i.name} (x${i.quantity})`).join('<br>');
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${order.id}</strong></td>
                    <td style="white-space: nowrap;">${dateFormatted}</td>
                    <td>
                        <strong>${order.customer.name}</strong><br>
                        <small>${order.customer.email}</small><br>
                        <small>${order.customer.phone}</small>
                    </td>
                    <td><small>${order.customer.address}</small></td>
                    <td><small>${itemsList}</small></td>
                    <td><strong class="text-gold">${totalFormatted}</strong><br><small>${order.paymentMethod === 'transfer' ? 'Transferencia' : 'Mercado Pago'}</small></td>
                    <td>
                        <span class="adm-badge badge-${order.status.toLowerCase()}">${order.status}</span>
                    </td>
                    <td>
                        <select class="adm-status-select" data-id="${order.id}">
                            <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="Aprobado" ${order.status === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                            <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
                            <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
                        <button class="btn btn-delete-order" data-id="${order.id}" style="padding:4px 8px; font-size:0.7rem; background:#f44336; margin-top:4px;">Eliminar</button>
                    </td>
                `;
                
                // Cambiar estado listener
                tr.querySelector('.adm-status-select').addEventListener('change', (e) => {
                    updateOrderStatus(order.id, e.target.value);
                });
                
                // Eliminar pedido listener
                tr.querySelector('.btn-delete-order').addEventListener('click', () => {
                    if (confirm(`¿Estás seguro de eliminar el pedido ${order.id}?`)) {
                        deleteOrder(order.id);
                    }
                });
                
                tableBody.appendChild(tr);
            });
        };

        const updateOrderStatus = (orderId, newStatus) => {
            const orders = JSON.parse(localStorage.getItem('el_arrebato_orders')) || [];
            const idx = orders.findIndex(o => o.id === orderId);
            if (idx !== -1) {
                orders[idx].status = newStatus;
                localStorage.setItem('el_arrebato_orders', JSON.stringify(orders));
                renderOrdersTable();
            }
        };

        const deleteOrder = (orderId) => {
            let orders = JSON.parse(localStorage.getItem('el_arrebato_orders')) || [];
            orders = orders.filter(o => o.id !== orderId);
            localStorage.setItem('el_arrebato_orders', JSON.stringify(orders));
            renderOrdersTable();
        };

        // 3. Renderizar Consultas Mayoristas y Contactos
        const renderInquiriesTable = () => {
            const tableBody = document.getElementById('adm-inquiries-table');
            if (!tableBody) return;
            
            const inquiries = JSON.parse(localStorage.getItem('el_arrebato_inquiries')) || [];
            
            if (inquiries.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No se registraron consultas aún.</td></tr>`;
                return;
            }
            
            tableBody.innerHTML = '';
            inquiries.forEach((inq, index) => {
                const date = new Date(inq.date).toLocaleString('es-AR');
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="white-space: nowrap;">${date}</td>
                    <td><strong>${inq.name}</strong><br><small>${inq.company || '-'}</small></td>
                    <td>${inq.city || '-'}</td>
                    <td><a href="https://wa.me/${inq.whatsapp.replace(/[^0-9]/g,'')}" target="_blank" class="text-gold">${inq.whatsapp}</a></td>
                    <td>${inq.email}</td>
                    <td><span class="adm-badge badge-info">${inq.type}</span></td>
                    <td><small>${inq.message}</small></td>
                    <td>
                        <button class="btn btn-delete-inquiry" data-idx="${index}" style="padding:4px 8px; font-size:0.7rem; background:#f44336;">Eliminar</button>
                    </td>
                `;
                
                tr.querySelector('.btn-delete-inquiry').addEventListener('click', () => {
                    if (confirm('¿Eliminar esta consulta?')) {
                        let currentInq = JSON.parse(localStorage.getItem('el_arrebato_inquiries')) || [];
                        currentInq.splice(index, 1);
                        localStorage.setItem('el_arrebato_inquiries', JSON.stringify(currentInq));
                        renderInquiriesTable();
                    }
                });
                
                tableBody.appendChild(tr);
            });
        };

        // 4. Renderizar Suscripciones a Boletín (Newsletter)
        const renderNewsletterTable = () => {
            const tableBody = document.getElementById('adm-news-table');
            if (!tableBody) return;
            
            const signups = JSON.parse(localStorage.getItem('el_arrebato_newsletter')) || [];
            
            if (signups.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay suscripciones registradas aún.</td></tr>`;
                return;
            }
            
            tableBody.innerHTML = '';
            signups.forEach((s, index) => {
                const regDate = new Date(s.date).toLocaleString('es-AR');
                const birthFormatted = s.dob ? new Date(s.dob).toLocaleDateString('es-AR') : '-';
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${s.name}</strong></td>
                    <td>${s.email}</td>
                    <td>${birthFormatted}</td>
                    <td>${regDate}</td>
                    <td>
                        <button class="btn btn-delete-news" data-idx="${index}" style="padding:4px 8px; font-size:0.7rem; background:#f44336;">Eliminar</button>
                    </td>
                `;
                
                tr.querySelector('.btn-delete-news').addEventListener('click', () => {
                    if (confirm('¿Eliminar esta suscripción?')) {
                        let currentSignups = JSON.parse(localStorage.getItem('el_arrebato_newsletter')) || [];
                        currentSignups.splice(index, 1);
                        localStorage.setItem('el_arrebato_newsletter', JSON.stringify(currentSignups));
                        renderNewsletterTable();
                    }
                });
                
                tableBody.appendChild(tr);
            });
        };

        // 5. Testimonios Editor (Aprobar, Agregar, Ocultar)
        const renderTestimonialsEditor = () => {
            const container = document.getElementById('adm-testimonials-container');
            if (!container) return;
            
            db = getDB();
            container.innerHTML = '';
            
            db.testimonials.forEach((test) => {
                const card = document.createElement('div');
                card.className = 'adm-testimonial-card';
                card.style = `
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid ${test.active ? 'var(--color-gold)' : 'var(--color-border-light)'};
                    padding: 20px;
                    border-radius: var(--radius-md);
                    margin-bottom: 16px;
                `;
                
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <strong>${test.name}</strong>
                        <div>
                            <span class="adm-badge ${test.active ? 'badge-aprobado' : 'badge-pendiente'}">${test.active ? 'Visible en web' : 'Oculto'}</span>
                            <span class="adm-badge badge-info" style="margin-left:6px;">${test.stars} ★</span>
                        </div>
                    </div>
                    <p style="font-style:italic; font-size:0.9rem; margin-bottom:16px; color:var(--color-gray-warm)">"${test.text}"</p>
                    <div style="display:flex; gap:12px; font-size:0.8rem;">
                        <button class="btn btn-toggle-test" style="padding:6px 12px; background:rgba(255,255,255,0.05); border:1px solid var(--color-border);">${test.active ? 'Ocultar' : 'Hacer Visible'}</button>
                        <button class="btn btn-delete-test" style="padding:6px 12px; background:#f44336;">Eliminar</button>
                    </div>
                `;
                
                // Toggle active/inactive
                card.querySelector('.btn-toggle-test').addEventListener('click', () => {
                    test.active = !test.active;
                    saveDB(db);
                    renderTestimonialsEditor();
                });
                
                // Eliminar testimonio
                card.querySelector('.btn-delete-test').addEventListener('click', () => {
                    if (confirm('¿Seguro que querés eliminar esta reseña?')) {
                        db.testimonials = db.testimonials.filter(t => t.id !== test.id);
                        saveDB(db);
                        renderTestimonialsEditor();
                    }
                });
                
                container.appendChild(card);
            });
        };

        // Agregar nuevo testimonio
        const formNewTestimonial = document.getElementById('adm-add-test-form');
        if (formNewTestimonial) {
            formNewTestimonial.onsubmit = (e) => {
                e.preventDefault();
                const name = document.getElementById('test-new-name').value.trim();
                const stars = parseInt(document.getElementById('test-new-stars').value);
                const text = document.getElementById('test-new-text').value.trim();
                const verified = document.getElementById('test-new-verified').checked;
                
                if (!name || !text) {
                    alert('Por favor, completá el nombre y el texto de la reseña.');
                    return;
                }
                
                const newTest = {
                    id: Date.now(),
                    name,
                    stars,
                    text,
                    verified,
                    active: true // Nace activo
                };
                
                db.testimonials.push(newTest);
                saveDB(db);
                formNewTestimonial.reset();
                renderTestimonialsEditor();
                alert('Testimonio agregado y publicado con éxito.');
            };
        }

        // 6. Resumen de Analítica y Métricas (Métricas de la Tienda)
        const renderAnalyticsOverview = () => {
            const tableBody = document.getElementById('adm-analytics-table');
            const metricsGrid = document.getElementById('adm-analytics-metrics');
            if (!tableBody || !metricsGrid) return;
            
            const events = JSON.parse(localStorage.getItem('el_arrebato_analytics')) || [];
            
            // Consolidar totales por evento
            const eventCounts = events.reduce((acc, ev) => {
                acc[ev.event] = (acc[ev.event] || 0) + 1;
                return acc;
            }, {});
            
            // Métricas resumidas
            const views = eventCounts['Age Gate Passed'] || 0;
            const carts = eventCounts['Add To Cart'] || 0;
            const purchases = eventCounts['Purchase'] || 0;
            
            const convRate = views > 0 ? ((purchases / views) * 100).toFixed(1) : 0;
            
            metricsGrid.innerHTML = `
                <div class="metric-card" style="background:rgba(255,255,255,0.01); border:1px solid var(--color-border-light); padding:20px; border-radius:var(--radius-md); text-align:center;">
                    <div style="font-size:0.75rem; text-transform:uppercase; color:var(--color-gray-warm); margin-bottom:8px;">Visitas Únicas (Age Gate)</div>
                    <div style="font-size:2rem; font-weight:bold; color:var(--color-ivory);">${views}</div>
                </div>
                <div class="metric-card" style="background:rgba(255,255,255,0.01); border:1px solid var(--color-border-light); padding:20px; border-radius:var(--radius-md); text-align:center;">
                    <div style="font-size:0.75rem; text-transform:uppercase; color:var(--color-gray-warm); margin-bottom:8px;">Agregados al Carrito</div>
                    <div style="font-size:2rem; font-weight:bold; color:var(--color-gold);">${carts}</div>
                </div>
                <div class="metric-card" style="background:rgba(255,255,255,0.01); border:1px solid var(--color-border-light); padding:20px; border-radius:var(--radius-md); text-align:center;">
                    <div style="font-size:0.75rem; text-transform:uppercase; color:var(--color-gray-warm); margin-bottom:8px;">Ventas Completadas</div>
                    <div style="font-size:2rem; font-weight:bold; color:#4CAF50;">${purchases}</div>
                </div>
                <div class="metric-card" style="background:rgba(255,255,255,0.01); border:1px solid var(--color-border-light); padding:20px; border-radius:var(--radius-md); text-align:center;">
                    <div style="font-size:0.75rem; text-transform:uppercase; color:var(--color-gray-warm); margin-bottom:8px;">Tasa de Conversión</div>
                    <div style="font-size:2rem; font-weight:bold; color:var(--color-sunset);">${convRate}%</div>
                </div>
            `;
            
            // Detalle de eventos en tabla
            if (events.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No hay eventos registrados.</td></tr>`;
                return;
            }
            
            tableBody.innerHTML = '';
            // Mostrar los últimos 15 eventos
            const recentEvents = [...events].reverse().slice(0, 15);
            recentEvents.forEach(ev => {
                const date = new Date(ev.timestamp).toLocaleString('es-AR');
                const paramsStr = Object.entries(ev.params).map(([k,v]) => `${k}: ${v}`).join(', ') || '-';
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${date}</td>
                    <td><strong>${ev.event}</strong></td>
                    <td><small>${paramsStr}</small></td>
                `;
                tableBody.appendChild(tr);
            });
        };

        // Cargar Ajustes inicialmente
        loadSettingsFields();
        
        // Agregar botón de Logout administrativo
        const logoutBtn = document.getElementById('admin-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('admin_authenticated');
                window.location.reload();
            });
        }
    }
});
