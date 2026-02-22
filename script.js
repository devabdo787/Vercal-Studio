// استعادة البيانات أو إنشاء مصفوفة فارغة
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

// دالة الحفظ
function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

// دالة إضافة منتج (محدثة وسليمة)
function addProduct() {
    const name = document.getElementById('p-name').value;
    const priceInput = document.getElementById('p-price').value;
    const method = document.getElementById('p-method').value || ""; 
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;

    if(!name || !priceInput) return alert("يرجى إدخال اسم المنتج والسعر!");

    const id = Date.now();
    const price = parseFloat(priceInput);

    products.push({ 
        id, name, price, method, desc, img, 
        currentPrice: price, 
        hasDiscount: false 
    });
    
    save();
    alert("✅ تم النشر!");
    location.reload(); 
}

// دالة العرض (الرسم) - محمية من الأخطاء
function render() {
    const list = document.getElementById('product-list');
    if(!list) return; // حماية لو مش في صفحة المتجر

    if (products.length === 0) {
        list.innerHTML = "<p style='text-align:center; width:100%; padding:20px;'>لا يوجد منتجات حالياً..</p>";
        return;
    }

    list.innerHTML = products.map((p, i) => {
        // حماية: لو المنتج قديم ومفهوش method
        const pMethod = p.method || ""; 
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

// دالة حذف منتج
function deleteProduct(i) {
    if(confirm("حذف؟")) { products.splice(i, 1); save(); render(); }
}

// دالة كود الخصم
function addCoupon() {
    const code = document.getElementById('c-code').value;
    const pct = parseFloat(document.getElementById('c-pct').value);
    if(code && pct) { coupons[code] = pct; save(); alert("تم حفظ الكود"); }
}

function applyCoupon(i) {
    let code = prompt("أدخل الكود:");
    if(coupons[code] && !usedCoupons[products[i].id]) {
        products[i].currentPrice *= (1 - coupons[code]/100);
        products[i].hasDiscount = true;
        usedCoupons[products[i].id] = true;
        save(); render();
    }
}

// تشغيل عند التحميل
window.onload = render;
