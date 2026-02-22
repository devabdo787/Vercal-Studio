let products = JSON.parse(localStorage.getItem('v_products')) || [];
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
}

function addProduct() {
    const name = document.getElementById('p-name')?.value;
    const price = document.getElementById('p-price')?.value;
    const method = document.getElementById('p-method')?.value || ""; 
    const desc = document.getElementById('p-desc')?.value;
    const img = document.getElementById('p-img')?.value;

    if (!name || !price) return alert("أكمل البيانات أولاً!");

    products.push({ id: Date.now(), name, price, method, desc, img });
    save();
    alert("✅ تم إضافة المنتج بنجاح!");
    location.reload();
}

function render() {
    const list = document.getElementById('product-list');
    if (!list) return;

    list.innerHTML = products.map((p, i) => `
        <div class="card" style="background:#111; border-radius:10px; padding:15px; border:1px solid #222; position:relative;">
            ${isAdmin ? `<button onclick="deleteProduct(${i})" style="position:absolute; top:10px; right:10px; background:red; color:white; border:none; border-radius:5px; cursor:pointer; padding:5px 10px;">×</button>` : ''}
            <img src="${p.img || ''}" style="width:100%; height:180px; object-fit:cover; border-radius:5px;">
            <div class="card-content">
                <h3 style="margin:10px 0;">${p.name}</h3>
                <p style="color:#aaa; font-size:0.9rem;">${p.desc}</p>
                <div class="price-tag" style="margin:15px 0;">
                    <span style="color:#00ff00; font-weight:bold; font-size:1.2rem;">${p.price} ${p.method}</span>
                </div>
                <a href="https://discord.gg/3tDGtJNSKE" target="_blank" style="display:block; text-align:center; background:#5865F2; color:white; padding:10px; text-decoration:none; border-radius:5px; font-weight:bold;">شراء الآن</a>
            </div>
        </div>`).join('');
}

function deleteProduct(i) {
    if(confirm("هل أنت متأكد من حذف هذا المنتج؟")) { products.splice(i, 1); save(); render(); }
}

window.addEventListener('DOMContentLoaded', render);
