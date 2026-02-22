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
    const price = document.getElementById('p-price').value;
    const method = document.getElementById('p-method').value || ""; 
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;

    if(!name || !price) return alert("الاسم والسعر ضروريين!");

    products.push({ 
        id: Date.now(), 
        name, 
        price: parseFloat(price), 
        method, 
        desc, 
        img, 
        currentPrice: parseFloat(price), 
        hasDiscount: false 
    });
    
    save();
    alert("✅ المنتج نزل المتجر!");
    location.reload();
}

function render() {
    const list = document.getElementById('product-list');
    if(!list) return;

    list.innerHTML = products.map((p, i) => `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${i})">×</button>` : ''}
            <img src="${p.img || ''}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="price-tag">
                    ${p.hasDiscount 
                        ? `<span style="text-decoration:line-through; color:red; font-size:0.8rem;">${p.price}</span> <span style="color:#00ff00;">${p.currentPrice.toFixed(2)} ${p.method}</span>` 
                        : `<span style="color:#00ff00;">${p.price} ${p.method}</span>`
                    }
                </div>
                <button onclick="applyCoupon(${i})" style="width:100%; margin-bottom:5px;">كود خصم</button>
                <a href="https://discord.gg/3tDGtJNSKE" target="_blank" class="btn-buy">شراء الآن</a>
            </div>
        </div>
    `).join('');
}

function deleteProduct(i) {
    if(confirm("تحذف المنتج؟")) { products.splice(i, 1); save(); render(); }
}

function applyCoupon(i) {
    let code = prompt("كود الخصم:");
    if(coupons[code] && !usedCoupons[products[i].id]) {
        products[i].currentPrice *= (1 - coupons[code]/100);
        products[i].hasDiscount = true;
        usedCoupons[products[i].id] = true;
        save(); render();
    }
}

window.onload = render;
