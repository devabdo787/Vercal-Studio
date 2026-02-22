// بيانات الموقع
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

// حفظ البيانات
function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

// إضافة منتج
function addProduct() {
    const name = document.getElementById('p-name').value;
    const priceInput = document.getElementById('p-price').value;
    const method = document.getElementById('p-method').value || ""; 
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;

    if(!name || !priceInput) return alert("يرجى إدخال البيانات الأساسية!");

    const price = parseFloat(priceInput);
    products.push({ 
        id: Date.now(), 
        name, price, method, desc, img, 
        currentPrice: price, 
        hasDiscount: false 
    });
    
    save();
    alert("✅ تم إضافة المنتج!");
    location.reload(); 
}

// عرض المنتجات في الصفحة
function render() {
    const list = document.getElementById('product-list');
    if(!list) return;

    if (products.length === 0) {
        list.innerHTML = "<p style='text-align:center; width:100%; color:#888;'>المتجر فارغ حالياً..</p>";
        return;
    }

    list.innerHTML = products.map((p, i) => {
        const pMethod = p.method || ""; // حماية لو المنتج قديم
        const pPrice = p.price || 0;
        const pCurrent = p.currentPrice || pPrice;

        return `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${i})">×</button>` : ''}
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

// حذف وكوبونات
function deleteProduct(i) { if(confirm("حذف؟")) { products.splice(i, 1); save(); render(); } }
function addCoupon() {
    const code = document.getElementById('c-code').value;
    const pct = parseFloat(document.getElementById('c-pct').value);
    if(code && pct) { coupons[code] = pct; save(); alert("تم حفظ الكود"); }
}
function applyCoupon(i) {
    let code = prompt("أدخل كود الخصم:");
    if(coupons[code] && !usedCoupons[products[i].id]) {
        products[i].currentPrice *= (1 - coupons[code]/100);
        products[i].hasDiscount = true;
        usedCoupons[products[i].id] = true;
        save(); render();
    } else { alert("الكود غير صالح أو تم استخدامه"); }
}

// تشغيل العرض عند فتح الصفحة
window.addEventListener('DOMContentLoaded', render);
