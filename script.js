let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

// التحقق من صلاحية الإدارة (مخزنة في الجلسة الحالية فقط)
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

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

// دوال الإدارة
function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;
    const id = Date.now();
    if(!name || !price) return alert("أكمل البيانات");
    products.push({ id, name, price, desc, img, currentPrice: price, hasDiscount: false });
    save(); alert("تم نشر المنتج!");
}

function deleteProduct(i) {
    if(confirm("هل تريد حذف هذا المنتج نهائياً؟")) {
        products.splice(i, 1);
        save(); render();
    }
}

function addCoupon() {
    const code = document.getElementById('c-code').value;
    const pct = parseFloat(document.getElementById('c-pct').value);
    if(!code || !pct) return alert("أكمل البيانات");
    coupons[code] = pct;
    save(); alert("تم تفعيل الكود!");
}

// دوال المتجر
function applyCoupon(i) {
    const productId = products[i].id;
    if(usedCoupons[productId]) return alert("استخدمت كوداً لهذا المنتج مسبقاً!");

    let code = prompt("أدخل كود الخصم:");
    if(coupons[code]) {
        products[i].currentPrice = products[i].price - (products[i].price * (coupons[code]/100));
        products[i].hasDiscount = true;
        usedCoupons[productId] = code; 
        save(); render();
        alert("تم الخصم!");
    } else alert("كود خطأ");
}

function removeCoupon(i) {
    products[i].currentPrice = products[i].price;
    products[i].hasDiscount = false;
    render();
}

function render() {
    const list = document.getElementById('product-list');
    if(!list) return;
    list.innerHTML = products.map((p, i) => `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${i})">X</button>` : ''}
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
                    ${usedCoupons[p.id] ? 'تم الاستخدام سابقاً' : 'إضافة كود خصم'}
                   </button>`
            }
            <a href="https://discord.gg/3tDGtJNSKE" target="_blank" class="btn-buy" style="background:#fff; color:#000;">شراء الآن</a>
        </div>
    `).join('');
}
