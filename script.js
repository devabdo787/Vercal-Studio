// جلب البيانات المحفوظة
let products = JSON.parse(localStorage.getItem('v_products')) || [];
let coupons = JSON.parse(localStorage.getItem('v_coupons')) || {};
let usedCoupons = JSON.parse(localStorage.getItem('v_used')) || {}; 

function save() {
    localStorage.setItem('v_products', JSON.stringify(products));
    localStorage.setItem('v_coupons', JSON.stringify(coupons));
    localStorage.setItem('v_used', JSON.stringify(usedCoupons));
}

// دالة إضافة منتج (تُستدعى من adminpanel.html)
function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const desc = document.getElementById('p-desc').value;
    const img = document.getElementById('p-img').value;
    const id = Date.now();
    if(!name || !price) return alert("أكمل البيانات");
    
    products.push({ id, name, price, desc, img, currentPrice: price, hasDiscount: false });
    save();
    alert("تم الحفظ بنجاح!");
}

// دالة إضافة كود خصم (تُستدعى من adminpanel.html)
function addCoupon() {
    const code = document.getElementById('c-code').value;
    const pct = parseFloat(document.getElementById('c-pct').value);
    if(!code || !pct) return alert("أكمل البيانات");
    coupons[code] = pct;
    save();
    alert("تم تفعيل الكود!");
}

// دالة حذف منتج (متاحة للمالك فقط عند تفعيل وضع الإدارة)
function deleteProduct(i) {
    if(confirm("حذف المنتج؟")) {
        products.splice(i, 1);
        save();
        render();
    }
}
// ... باقي دوال الـ Render والـ ApplyCoupon زي ما هي ...
