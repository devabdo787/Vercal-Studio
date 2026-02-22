// استعادة البيانات من التخزين
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

// دالة إضافة منتج (محدثة بالكامل)
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
    alert("✅ تم إضافة المنتج للمتجر!");
    location.reload(); 
}

// دالة إضافة كود خصم
function addCoupon() {
    const code = document.getElementById('c-code').value;
    const pct = parseFloat(document.getElementById('c-pct').value);
    
    if(code && pct) { 
        coupons[code] = pct; 
        save(); 
        alert(`✅ تم تفعيل كود الخصم: ${code} بنسبة ${pct}%`); 
    } else {
        alert("يرجى ملء بيانات الكود!");
    }
}

// دالة حذف منتج
function deleteProduct(i) {
    if(confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}

// دالة تطبيق الخصم للزبون
function applyCoupon(i) {
    let code = prompt("أدخل كود الخصم للحصول على تخفيض:");
    if (!code) return;

    if(coupons[code]) {
        if(usedCoupons[products[i].id]) {
            alert("تم استخدام كود خصم على هذا المنتج بالفعل!");
            return;
        }
        
        products[i].currentPrice *= (1 - coupons[code]/100);
        products[i].hasDiscount = true;
        usedCoupons[products[i].id] = true;
        
        save(); 
        render();
        alert(`مبروك! حصلت على خصم ${coupons[code]}%`);
    } else {
        alert("كود الخصم غير صحيح!");
    }
}

// دالة العرض الأساسية (رسم الموقع)
function render() {
    const list = document.getElementById('product-list');
    if(!list) return; // عشان السكربت ما يوقفش لو أحنا في صفحة الإدارة

    if (products.length === 0) {
        list.innerHTML = "<p style='text-align:center; width:100%; color:#666;'>لا توجد منتجات حالياً..</p>";
        return;
    }

    list.innerHTML = products.map((p, i) => `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${i})">×</button>` : ''}
            <img src="${p.img || 'https://via.placeholder.com/300'}" alt="${p.name}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                
                <div class="price-tag">
                    ${p.hasDiscount 
                        ? `<span class="old-price">${p.price}</span> <span class="new-price">${p.currentPrice.toFixed(2)} ${p.method}</span>` 
                        : `<span class="new-price">${p.price} ${p.method}</span>`
                    }
                </div>

                <div class="card-actions">
                    <button onclick="applyCoupon(${i})" class="btn-coupon">كود خصم</button>
                    <a href="https://discord.gg/3tDGtJNSKE" target="_blank" class="btn-buy">شراء الآن</a>
                </div>
            </div>
        </div>
    `).join('');
}

// تشغيل العرض عند فتح الصفحة
render();
