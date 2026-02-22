// 1. استعادة البيانات من التخزين المحلي (localStorage)
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

// التأكد من حالة الإدارة (عن طريق تسجيل الدخول بالديسكورد)
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

// 2. دالة حفظ البيانات (تستدعى عند أي تغيير)
function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

// 3. دالة إضافة منتج (تستخدم في adminpanel.html)
function addProduct() {
    const name = document.getElementById('p-name')?.value;
    const priceInput = document.getElementById('p-price')?.value;
    const method = document.getElementById('p-method')?.value || ""; // الخانة الجديدة
    const desc = document.getElementById('p-desc')?.value;
    const img = document.getElementById('p-img')?.value;

    if (!name || !priceInput) {
        return alert("⚠️ يرجى إدخال اسم المنتج والسعر على الأقل!");
    }

    const price = parseFloat(priceInput);
    const id = Date.now(); // معرف فريد للمنتج

    products.push({ 
        id, 
        name, 
        price, 
        method, 
        desc, 
        img, 
        currentPrice: price, 
        hasDiscount: false 
    });
    
    save();
    alert("✅ تم نشر المنتج في المتجر بنجاح!");
    location.reload(); 
}

// 4. دالة عرض المنتجات (تستخدم في shop.html)
function render() {
    const list = document.getElementById('product-list');
    if (!list) return; // حماية السكربت إذا لم تكن في صفحة تحتوي على قائمة منتجات

    if (products.length === 0) {
        list.innerHTML = `<p style="text-align:center; width:100%; color:#888; padding:50px;">لا توجد منتجات متاحة حالياً في المتجر.</p>`;
        return;
    }

    list.innerHTML = products.map((p, i) => {
        // حماية البيانات: التأكد من وجود القيم لتجنب أخطاء JavaScript
        const pMethod = p.method || ""; 
        const pPrice = p.price || 0;
        const pCurrent = p.currentPrice || pPrice;

        return `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${i})" title="حذف المنتج">×</button>` : ''}
            <img src="${p.img || 'https://via.placeholder.com/300'}" alt="${p.name}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="price-tag">
                    ${p.hasDiscount 
                        ? `<span class="old-price">${pPrice}</span> <span class="new-price">${pCurrent.toFixed(2)} ${pMethod}</span>` 
                        : `<span class="new-price">${pPrice} ${pMethod}</span>`
                    }
                </div>
                <div class="card-actions">
                    <button onclick="applyCoupon(${i})" class="btn-coupon">كود خصم</button>
                    <a href="https://discord.gg/3tDGtJNSKE" target="_blank" class="btn-buy">شراء الآن</a>
                </div>
            </div>
        </div>`;
    }).join('');
}

// 5. دالة حذف المنتج (للأدمن فقط)
function deleteProduct(i) {
    if (confirm("❓ هل أنت متأكد من حذف هذا المنتج؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}

// 6. إدارة أكواد الخصم
function addCoupon() {
    const code = document.getElementById('c-code')?.value;
    const pct = parseFloat(document.getElementById('c-pct')?.value);
    
    if (code && pct) { 
        coupons[code] = pct; 
        save(); 
        alert("✅ تم تفعيل كود الخصم بنجاح!"); 
    } else {
        alert("⚠️ يرجى إدخال كود صحيح ونسبة خصم.");
    }
}

function applyCoupon(i) {
    let code = prompt("🎟️ أدخل كود الخصم:");
    if (!code) return;

    if (coupons[code]) {
        if (usedCoupons[products[i].id]) {
            return alert("❌ تم استخدام كود خصم لهذا المنتج مسبقاً!");
        }
        
        products[i].currentPrice *= (1 - coupons[code] / 100);
        products[i].hasDiscount = true;
        usedCoupons[products[i].id] = true;
        
        save(); 
        render();
        alert(`🎉 مبروك! حصلت على خصم ${coupons[code]}%`);
    } else {
        alert("❌ عذراً، هذا الكود غير صحيح أو انتهت صلاحيته.");
    }
}

// 7. تشغيل العرض تلقائياً عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', render);
