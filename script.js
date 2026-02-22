// 1. استعادة كل البيانات القديمة (منتجات، كوبونات، سجل الاستخدام)
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

// التحقق إذا كان المستخدم أدمن (يتم ضبطها من صفحة الإدارة بعد التحقق من الرتبة)
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

// 2. دالة حفظ البيانات (عشان مفيش حاجة تضيع منك)
function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

// 3. دالة إضافة منتج (التعديل: إضافة خانة p-method)
function addProduct() {
    const name = document.getElementById('p-name')?.value;
    const priceInput = document.getElementById('p-price')?.value;
    const method = document.getElementById('p-method')?.value || ""; // التعديل هنا
    const desc = document.getElementById('p-desc')?.value;
    const img = document.getElementById('p-img')?.value;

    if (!name || !priceInput) return alert("⚠️ يرجى إدخال اسم المنتج والسعر!");

    const id = Date.now();
    const price = parseFloat(priceInput);

    products.push({ 
        id, 
        name, 
        price, 
        method, // حفظ طريقة الدفع (Credit, USDT, إلخ)
        desc, 
        img, 
        currentPrice: price, 
        hasDiscount: false 
    });
    
    save();
    alert("✅ تم إضافة المنتج بنجاح!");
    location.reload(); 
}

// 4. دالة عرض المنتجات (التعديل: مسح EGP وعرض طريقة الدفع)
function render() {
    const list = document.getElementById('product-list');
    if (!list) return; // حماية لو الصفحة مش هي صفحة المتجر

    if (products.length === 0) {
        list.innerHTML = `<p style="text-align:center; width:100%; color:#888;">المتجر فارغ حالياً..</p>`;
        return;
    }

    list.innerHTML = products.map((p, i) => {
        // حماية للمنتجات القديمة اللي مكنش ليها method
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

// 5. دالة حذف المنتج (القديمة)
function deleteProduct(i) {
    if (confirm("❓ هل تريد حذف هذا المنتج؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}

// 6. نظام الكوبونات (القديم)
function addCoupon() {
    const code = document.getElementById('c-code')?.value;
    const pct = parseFloat(document.getElementById('c-pct')?.value);
    if (code && pct) { 
        coupons[code] = pct; 
        save(); 
        alert("✅ تم تفعيل الكود!"); 
    }
}

function applyCoupon(i) {
    let code = prompt("🎟️ أدخل كود الخصم:");
    if (!code) return;

    if (coupons[code]) {
        if (usedCoupons[products[i].id]) {
            return alert("❌ استخدمت كود لهذا المنتج مسبقاً!");
        }
        products[i].currentPrice *= (1 - coupons[code] / 100);
        products[i].hasDiscount = true;
        usedCoupons[products[i].id] = true;
        save(); 
        render();
        alert(`مبروك خصم ${coupons[code]}%`);
    } else {
        alert("كود غير صحيح!");
    }
}

// تشغيل العرض فور تحميل الصفحة
window.addEventListener('DOMContentLoaded', render);
