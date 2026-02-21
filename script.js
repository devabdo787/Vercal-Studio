let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
// مصفوفة لتتبع الأكواد المستخدمة على هذا المتصفح
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 
let isAdmin = false;

function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    render();
}

function checkAdmin() {
    let p = prompt("كلمة مرور الإدارة:");
    if(p === "VERCAL2026") {
        isAdmin = true;
        showSection('admin');
    } else alert("خطأ!");
}

function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;
    const id = Date.now(); // معرف فريد للمنتج
    if(!name || !price) return alert("أكمل البيانات");
    products.push({ id, name, price, desc, img, currentPrice: price, hasDiscount: false });
    save(); render(); alert("تم النشر");
}

function deleteProduct(i) {
    if(confirm("حذف المنتج؟")) {
        products.splice(i, 1);
        save(); render();
    }
}

function addCoupon() {
    const code = document.getElementById('c-code').value;
    const pct = parseFloat(document.getElementById('c-pct').value);
    if(!code || !pct) return alert("أكمل البيانات");
    coupons[code] = pct;
    save(); alert("تم التفعيل");
}

function applyCoupon(i) {
    const productId = products[i].id;

    // التحقق إذا كان الشخص استخدم كود لهذا المنتج مسبقاً
    if(usedCoupons[productId]) {
        return alert("لقد استخدمت كود خصم لهذا المنتج مسبقاً. لا يمكن الاستخدام أكثر من مرة.");
    }

    let code = prompt("أدخل كود الخصم:");
    if(coupons[code]) {
        products[i].currentPrice = products[i].price - (products[i].price * (coupons[code]/100));
        products[i].hasDiscount = true;

        // تسجيل أن هذا الكود استُخدم لهذا المنتج
        usedCoupons[productId] = code; 

        save();
        render();
        alert(`تم تطبيق خصم ${coupons[code]}% بنجاح!`);
    } else {
        alert("الكود غير صحيح");
    }
}

function removeCoupon(i) {
    const productId = products[i].id;
    products[i].currentPrice = products[i].price;
    products[i].hasDiscount = false;

    // ملاحظة: حتى لو ألغى تفعيل الكود، سيبقى مسجلاً أنه استخدمه لمنع التلاعب
    render();
}

function render() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map((p, i) => `
        <div class="card">
            <button class="delete-btn" style="display:${isAdmin ? 'block' : 'none'}" onclick="deleteProduct(${i})">X</button>
            ${p.img ? `<img src="${p.img}">` : ''} 
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="price-tag">
                ${p.hasDiscount 
                    ? `<span class="old-price">${p.price}</span> <span class="new-price">${p.currentPrice}</span>` 
                    : `<span>السعر: ${p.price}</span>`
                }
            </div>
            ${p.hasDiscount 
                ? `<button onclick="removeCoupon(${i})" style="color:#ff4d4d; border-color:#ff4d4d">إلغاء تفعيل الكود</button>` 
                : `<button onclick="applyCoupon(${i})" class="${usedCoupons[p.id] ? 'used-coupon' : ''}">
                    ${usedCoupons[p.id] ? 'تم استخدام كود سابقاً' : 'إضافة كود خصم'}
                   </button>`
            }
            <a href="https://discord.gg/3tDGtJNSKE" target="_blank" class="btn-buy" style="background:#fff; color:#000;">شراء الآن</a>
        </div>
    `).join('');
}

render();