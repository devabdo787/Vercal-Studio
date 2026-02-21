// --- إعدادات البيانات الأساسية ---
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

// التحقق من حالة الإدارة (تعتمد على النجاح في تسجيل دخول ديسكورد)
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

// دالة الحفظ في ذاكرة المتصفح
function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

// --- وظائف التنقل في الموقع ---
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }
    render();
}

// --- وظائف الإدارة (تُستدعى من adminpanel.html) ---

function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;
    const id = Date.now();

    if(!name || !price) return alert("يرجى إكمال البيانات الأساسية (الاسم والسعر)");
    
    products.push({ 
        id, 
        name, 
        price, 
        desc, 
        img, 
        currentPrice: price, 
        hasDiscount: false 
    });
    
    save();
    alert("تم نشر المنتج في المتجر بنجاح!");
    // مسح الخانات بعد الإضافة
    document.querySelectorAll('input, textarea').forEach(input => input.value = '');
}

function deleteProduct(i) {
    if(confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}

function addCoupon() {
    const code = document.getElementById('c-code').value;
    const pct = parseFloat(document.getElementById('c-pct').value);
    
    if(!code || !pct) return alert("يرجى إدخال رمز الكود ونسبة الخصم");
    
    coupons[code] = pct;
    save();
    alert(`تم تفعيل كود الخصم (${code}) بنسبة ${pct}%`);
}

// --- وظائف المتجر والزبائن ---

function applyCoupon(i) {
    const productId = products[i].id;
    
    if(usedCoupons[productId]) {
        return alert("لقد استخدمت كود خصم لهذا المنتج مسبقاً!");
    }

    let code = prompt("أدخل كود الخصم المتاح:");
    if(!code) return;

    if(coupons[code]) {
        const discountAmount = products[i].price * (coupons[code] / 100);
        products[i].currentPrice = products[i].price - discountAmount;
        products[i].hasDiscount = true;
        
        // تسجيل أن هذا المنتج تم استخدام كود له (لحماية نظام الكود الواحد)
        usedCoupons[productId] = code; 
        
        save();
        render();
        alert(`مبروك! تم تطبيق خصم ${coupons[code]}%`);
    } else {
        alert("عذراً، هذا الكود غير صالح أو انتهت صلاحيته.");
    }
}

function removeCoupon(i) {
    products[i].currentPrice = products[i].price;
    products[i].hasDiscount = false;
    // اختياري: إذا أردت السماح للمستخدم بتجربة كود آخر، امسحه من usedCoupons
    // delete usedCoupons[products[i].id]; 
    save();
    render();
}

// --- دالة العرض الرئيسية (التي تبني المنتجات) ---

function render() {
    const list = document.getElementById('product-list');
    if(!list) return; // لضمان عدم حدوث خطأ إذا لم نكن في صفحة المتجر

    if (products.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#666; grid-column: 1/-1;">لا توجد منتجات معروضة حالياً.</p>`;
        return;
    }

    list.innerHTML = products.map((p, i) => `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" title="حذف المنتج" onclick="deleteProduct(${i})">×</button>` : ''}
            <img src="${p.img || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.desc || 'لا يوجد وصف متاح.'}</p>
            
            <div class="price-tag">
                ${p.hasDiscount 
                    ? `<span class="old-price">${p.price} EGP</span> <span class="new-price">${p.currentPrice.toFixed(2)} EGP</span>` 
                    : `<span class="new-price">السعر: ${p.price} EGP</span>`
                }
            </div>

            <div class="card-actions">
                ${p.hasDiscount 
                    ? `<button onclick="removeCoupon(${i})" style="color:#ff4d4d; border-color:#ff4d4d">إلغاء الخصم</button>` 
                    : `<button onclick="applyCoupon(${i})" class="${usedCoupons[p.id] ? 'used-coupon' : ''}">
                        ${usedCoupons[p.id] ? 'تم استخدام كود سابقاً' : 'استخدم كود خصم'}
                       </button>`
                }
                
                <a href="https://discord.gg/3tDGtJNSKE" target="_blank" class="btn-buy">
                    <i class="fab fa-discord"></i> شراء عبر الديسكورد
                </a>
            </div>
        </div>
    `).join('');
}

// تشغيل العرض الأولي
render();
