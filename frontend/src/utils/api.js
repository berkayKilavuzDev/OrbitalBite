const BASE_MENU_URL = "http://127.0.0.1:8000/api/menu";
const BASE_ORDER_URL = "http://127.0.0.1:8000/api/orders";

/* ✅ MENÜ API İŞLEMLERİ */

// ✅ Menü öğelerini getir
export const fetchMenuItems = async () => {
    try {
        const res = await fetch(`${BASE_MENU_URL}/menu-items/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return null;
    }
};

// ✅ Kategorileri getir
export const fetchCategories = async () => {
    try {
        const res = await fetch(`${BASE_MENU_URL}/categories/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
    }
};

// ✅ Belirli bir kategoriye bağlı opsiyonları getir
export const fetchCategoryOptions = async (categoryId) => {
    try {
        const res = await fetch(`${BASE_MENU_URL}/menu-options/category/${categoryId}/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching category options:", error);
        return null;
    }
};

// ✅ Belirli bir menü öğesine bağlı opsiyonları getir
export const fetchOptions = async (itemId) => {
    try {
        const res = await fetch(`${BASE_MENU_URL}/menu-options/item/${itemId}/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching options:", error);
        return null;
    }
};

// ✅ Opsiyon detaylarını getir (Opsiyon başlıklarına bağlı seçenekler)
export const fetchOptionDetails = async (optionId) => {
    try {
        const res = await fetch(`${BASE_MENU_URL}/option-details/${optionId}/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching option details:", error);
        return null;
    }
};

// ✅ Yan ürünleri getir (Örneğin içecekler, patates vb.)
export const fetchSideSelections = async (categoryId) => {
    try {
        const res = await fetch(`${BASE_MENU_URL}/side-selections/category/${categoryId}/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching side selections:", error);
        return null;
    }
};

/* ✅ SEPET API İŞLEMLERİ */

// ✅ Kullanıcının mevcut sepetini getir
export const fetchBasket = async () => {
    try {
        const res = await fetch(`${BASE_ORDER_URL}/get-basket/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching basket:", error);
        return null;
    }
};

// ✅ Sepete ürün ekle
export const addToBasket = async (basketData) => {
    try {
        const res = await fetch(`${BASE_ORDER_URL}/add-to-basket/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(basketData),
        });
        return await res.json();
    } catch (error) {
        console.error("Error adding to basket:", error);
        return null;
    }
};

// ✅ Sepetteki bir ürünü güncelle
export const updateBasket = async (basketData) => {
    try {
        const res = await fetch(`${BASE_ORDER_URL}/update-basket/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(basketData),
        });
        return await res.json();
    } catch (error) {
        console.error("Error updating basket:", error);
        return null;
    }
};

// ✅ Sepetten ürün sil
export const deleteFromBasket = async (itemId) => {
    try {
        const res = await fetch(`${BASE_ORDER_URL}/delete-from-basket/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_id: itemId }),
        });
        return await res.json();
    } catch (error) {
        console.error("Error deleting item from basket:", error);
        return null;
    }
};

/* ✅ SİPARİŞ API İŞLEMLERİ */

// ✅ Yeni bir sipariş oluştur
export const createOrder = async (orderData) => {
    try {
        const res = await fetch(`${BASE_ORDER_URL}/create-order/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });
        return await res.json();
    } catch (error) {
        console.error("Error creating order:", error);
        return null;
    }
};

// ✅ Sipariş geçmişini getir
export const fetchOrderHistory = async () => {
    try {
        const res = await fetch(`${BASE_ORDER_URL}/order-history/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching order history:", error);
        return null;
    }
};

// ✅ Sipariş durumunu güncelle
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const res = await fetch(`${BASE_ORDER_URL}/update-order-status/${orderId}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        return await res.json();
    } catch (error) {
        console.error("Error updating order status:", error);
        return null;
    }
};
