let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value; // نصي عشان يقبل أي عملة
    const method = document.getElementById('p-method').value || ""; // الخانة الجديدة
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;
    const id = Date.now();

    if(!name || !price) return alert("يرجى إدخال اسم المنتج والسعر");
    
    products.push({ 
        id, 
        name, 
        price: parseFloat(price), 
        method, // حفظ وسيلة الدفع
        desc, 
        img, 
        currentPrice: parseFloat(price), 
        hasDiscount: false 
    });
    
    save();
    alert("تم الإضافة بنجاح!");
    location.reload(); 
}

function deleteProduct(i) {
    if(confirm("حذف المنتج؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}

function render() {
    const list = document.getElementById('product-list');
    if(!list) return;

    list.innerHTML = products.map((p, i) => `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${i})">×</button>` : ''}
            <img src="${p.img || 'https://via.placeholder.com/300'}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            
            <div class="price-tag">
                ${p.hasDiscount 
                    ? `<span class="old-price">${p.price}</span> <span class="new-price">${p.currentPrice.toFixed(2)} ${p.method}</span>` 
                    : `<span class="new-price">${p.price} ${p.method}</span>`
                }
            </div>

            <div class="card-actions">
                <button onclick="applyCoupon(${i})">كود خصم</button>
                <a href="https://discord.gg/3tDGtJNSKE" target="_blank" class="btn-buy">شراء الآن</a>
            </div>
        </div>
    `).join('');
}

// الدوال التانية (applyCoupon, addCoupon) تفضل زي ما هي
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
    }
}

render();
