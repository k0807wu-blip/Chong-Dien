const CART_KEY = 'chongdien_cart';

const twd = n => `TWD ${new Intl.NumberFormat('zh-TW').format(n)}`;

const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function refreshCartBadge() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = getCartCount();
}

function addToCart(item) {
    const cart = getCart();
    const index = cart.findIndex(i => i.id === item.id && (i.size || '') === (item.size || ''));
    if (index >= 0) cart[index].qty += item.qty;
    else cart.push(item);
    setCart(cart);
    refreshCartBadge();
}
