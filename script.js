let products = JSON.parse(localStorage.getItem('v_products')) || [];
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

function save() { localStorage.setItem('v_products', JSON.stringify(products)); }

function addProduct() {
    const name = document.getElementById('p-name')?.value;
    const price = document.getElementById('p-price')?.value;
    const method = document.getElementById('p-method')?.value || ""; 
    const desc = document.getElementById('p-desc')?.value;
    const img = document.getElementById('p-img')?.value;

    if (!name || !price) return alert("يرجى إدخال الاسم والسعر!");

    products.push({ id: Date.now(), name, price, method, desc, img });
    save();
    alert("✅ تم نشر المنتج بنجاح!");
    location.reload();
}

function render() {
    const list = document.getElementById('product-list');
    if (!list) return;

    list.innerHTML = products.map((p, i) => `
        <div class="card">
            ${isAdmin ? `<button class="delete-btn" onclick="deleteProduct(${i})">×</button>` : ''}
            <img src="${p.img || ''}" onerror="this.src='https://via.placeholder.com/300'">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="price-tag">
                    <span style="color:#00ff00; font-weight:bold;">${p.price} ${p.method}</span>
                </div>
                <a href="https://discord.gg/3tDGtJNSKE" class="btn-buy" target="_blank">شراء الآن</a>
            </div>
        </div>`).join('');
}

function deleteProduct(i) {
    if(confirm("هل تريد حذف هذا المنتج؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}
window.onload = render;
