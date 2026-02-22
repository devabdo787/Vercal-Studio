// استعادة البيانات - السيستم القديم بتاعك
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

// دالة الحفظ
function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
}

// إضافة منتج (مع خانة طريقة الدفع اللي طلبتها)
function addProduct() {
    const name = document.getElementById('p-name')?.value;
    const price = document.getElementById('p-price')?.value;
    const method = document.getElementById('p-method')?.value || ""; // الخانة الجديدة
    const desc = document.getElementById('p-desc')?.value;
    const img = document.getElementById('p-img')?.value;

    if (!name || !price) return alert("أكمل البيانات!");

    products.push({ 
        id: Date.now(), 
        name, 
        price: parseFloat(price), 
        method, // حفظ العملة أو الطريقة (USDT, Credit, etc)
        desc, 
        img 
    });
    
    save();
    alert("✅ تم الإضافة بنجاح");
    location.reload();
}

// العرض (تم مسح EGP وإضافة خانة الـ method)
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

// حذف المنتج
function deleteProduct(i) {
    if(confirm("حذف المنتج؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}

// التشغيل عند التحميل
window.onload = render;
