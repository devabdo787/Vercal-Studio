let products = JSON.parse(localStorage.getItem('v_products')) || [];
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

function save() { localStorage.setItem('v_products', JSON.stringify(products)); }

function addProduct() {
    const name = document.getElementById('p-name')?.value;
    const price = document.getElementById('p-price')?.value;
    const method = document.getElementById('p-method')?.value || ""; 
    const desc = document.getElementById('p-desc')?.value;
    const img = document.getElementById('p-img')?.value;

    if (!name || !price) return alert("البيانات ناقصة!");

    products.push({ id: Date.now(), name, price, method, desc, img });
    save();
    location.reload();
}

function render() {
    const list = document.getElementById('product-list');
    if (!list) return;

    list.innerHTML = products.map((p, i) => `
        <div class="card" style="background:#111; border-radius:10px; padding:15px; border:1px solid #222; position:relative;">
            ${isAdmin ? `<button onclick="deleteProduct(${i})" style="position:absolute; top:5px; right:5px; background:red; color:white; border:none; cursor:pointer;">×</button>` : ''}
            <img src="${p.img || ''}" style="width:100%; border-radius:5px;">
            <h3>${p.name}</h3>
            <p style="color:#aaa;">${p.desc}</p>
            <div style="color:#00ff00; font-weight:bold;">${p.price} ${p.method}</div>
            <a href="https://discord.gg/3tDGtJNSKE" style="display:block; background:#5865F2; color:white; text-align:center; padding:10px; border-radius:5px; margin-top:10px; text-decoration:none;">شراء الآن</a>
        </div>`).join('');
}

function deleteProduct(i) {
    if(confirm("حذف؟")) { products.splice(i, 1); save(); render(); }
}

window.onload = render;
