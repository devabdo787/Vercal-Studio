// 1. استعادة البيانات من التخزين المحلي (localStorage)
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

// التأكد من حالة الإدارة (يتم تفعيلها بعد نجاح تسجيل الدخول بالديسكورد)
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

// 2. دالة حفظ البيانات (تستدعى عند أي إضافة أو تعديل)
function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

// 3. دالة إضافة منتج (تشمل خانة طريقة الدفع p-method)
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
    const id = Date.now(); 

    products.push({ 
        id, 
        name, 
        price, 
        method, // حفظ طريقة الدفع (مثل Credit أو USDT)
        desc, 
        img, 
        currentPrice: price, 
        hasDiscount: false 
    });
    
    save();
    alert("✅ تم نشر المنتج في المتجر بنجاح!");
    location.reload(); 
}

// 4. دالة عرض المنتجات (لعرضها في shop.html)
function render() {
    const list = document.getElementById('product-list');
    if (!list) return; 

    if (products.length === 0) {
        list.innerHTML = `<p style="text-align:center; width:100%; color:#888; padding:50px;">لا توجد منتجات متاحة حالياً.</p>`;
        return;
    }

    list.innerHTML = products.map((p, i) => {
        const pMethod = p.method || ""; // جلب طريقة الدفع
        const pPrice = p.price || 0;
        const pCurrent = p.currentPrice || pPrice;

        return `
        <div class="card" style="background: #111; border: 1px solid #222; border-radius: 10px; overflow: hidden; position: relative;">
            ${isAdmin ? `<button onclick="deleteProduct(${i})" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; cursor: pointer; border-radius: 5px;">×</button>` : ''}
            <img src="${p.img || 'https://via.placeholder.com/300'}" style="width: 100%; height: 180px; object-fit: cover;">
            <div style="padding: 15px;">
                <h3 style="margin: 0; font-size: 1.2rem;">${p.name}</h3>
                <p style="color: #aaa; font-size: 0.9rem; margin: 10px 0;">${p.desc}</p>
                <div style="margin: 15px 0; font-weight: bold; color: #00ff00;">
                    ${p.hasDiscount 
                        ? `<span style="text-decoration: line-through; color: #ff4d4d; font-size: 0.8rem; margin-left: 10px;">${pPrice}</span> <span>${pCurrent.toFixed(2)} ${pMethod}</span>` 
                        : `<span>${pPrice} ${pMethod}</span>`
                    }
                </div>
                <button onclick="applyCoupon(${i})" style="width: 100%; background: #333; color: #fff; border: none; padding: 8px; border-radius: 5px; cursor: pointer; margin-bottom: 5px;">كود خصم</button>
                <a href="https://discord.gg/3tDGtJNSKE" target="_blank" style="display: block; background: #5865F2; color: #fff; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-weight: bold;">شراء الآن</a>
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
        alert("✅ تم إضافة كود الخصم!"); 
    }
}

function applyCoupon(i) {
    let code = prompt("🎟️ أدخل كود الخصم:");
    if (!code) return;

    if (coupons[code]) {
        if (usedCoupons[products[i].id]) {
            return alert("❌ تم استخدام كود لهذا المنتج مسبقاً!");
        }
        
        products[i].currentPrice *= (1 - coupons[code] / 100);
        products[i].hasDiscount = true;
        usedCoupons[products[i].id] = true;
        
        save(); 
        render();
        alert(`🎉 مبروك! حصلت على خصم ${coupons[code]}%`);
    } else {
        alert("❌ الكود غير صحيح!");
    }
}

// تشغيل العرض تلقائياً عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', render);
