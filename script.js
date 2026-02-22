let products = JSON.parse(localStorage.getItem('v_products')) || [];
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
}

function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const method = document.getElementById('p-method').value || ""; 
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;

    if(!name || !price) return alert("أدخل الاسم والسعر!");

    products.push({ id: Date.now(), name, price, method, desc, img });
    save();
    alert("تم الإضافة!");
    location.reload();
}

function render() {
    const list = document.getElementById('product-list');
    if(!list) return;

    if(products.length === 0) {
        list.innerHTML = "<p>لا يوجد منتجات حالياً.</p>";
        return;
    }

    list.innerHTML = products.map((p, i) => `
        <div style="background: #111; border: 1px solid #222; border-radius: 10px; overflow: hidden; position: relative;">
            ${isAdmin ? `<button onclick="deleteProduct(${i})" style="position: absolute; right: 10px; top: 10px; background: red; color: white; border: none; cursor: pointer;">X</button>` : ''}
            <img src="${p.img || 'https://via.placeholder.com/150'}" style="width: 100%; height: 150px; object-fit: cover;">
            <div style="padding: 15px;">
                <h3>${p.name}</h3>
                <p style="color: #aaa; font-size: 0.9rem;">${p.desc}</p>
                <p style="color: #00ff00; font-weight: bold;">${p.price} ${p.method}</p>
                <a href="https://discord.gg/3tDGtJNSKE" style="background: #5865F2; color: white; display: block; text-align: center; padding: 10px; text-decoration: none; border-radius: 5px; margin-top: 10px;">شراء الآن</a>
            </div>
        </div>
    `).join('');
}

function deleteProduct(i) {
    if(confirm("حذف المنتج؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}

window.onload = render;
