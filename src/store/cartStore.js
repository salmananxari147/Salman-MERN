import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],

            // Add or update item in cart
            addToCart: (item) => {
                const { cartItems } = get();
                // Item signature based on product ID AND gazSelected uniqueness
                // So a 1.5 Gaz product is treated differently than a 2.0 Gaz of the same product
                const existingItem = cartItems.find(
                    (x) => x.product === item.product && x.gazSelected === item.gazSelected
                );

                if (existingItem) {
                    // If it exists, update quantity and price
                    set({
                        cartItems: cartItems.map((x) =>
                            x.product === existingItem.product && x.gazSelected === existingItem.gazSelected
                                ? item
                                : x
                        ),
                    });
                } else {
                    // If it doesn't exist, push to array
                    set({ cartItems: [...cartItems, item] });
                }
            },

            // Remove specific item from cart
            removeFromCart: (productId, gazSelected) => {
                set((state) => ({
                    cartItems: state.cartItems.filter(
                        // Only remove the exact match of product + gaz
                        (x) => !(x.product === productId && x.gazSelected === gazSelected)
                    ),
                }));
            },

            // Update quantity of a specific item
            updateQuantity: (productId, gazSelected, newQuantity) => {
                const { cartItems } = get();

                set({
                    cartItems: cartItems.map((x) => {
                        if (x.product === productId && x.gazSelected === gazSelected) {
                            // Formula: (basePricePerGaz * gazSelected) * quantity
                            // Let's assume the component calculates the final price and we update it here
                            // But typically, the store recalculates:
                            const singleUnitPrice = x.price / x.quantity; // get unit price
                            return { ...x, quantity: newQuantity, price: singleUnitPrice * newQuantity }
                        }
                        return x;
                    })
                });
            },

            clearCart: () => set({ cartItems: [] }),

            // Derive Totals
            getTotals: () => {
                const { cartItems } = get();
                const itemsPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
                return {
                    totalPrice: Number(itemsPrice.toFixed(2)),
                    totalItems: cartItems.reduce((acc, item) => acc + item.quantity, 0)
                };
            },

            // Setup checkout fields
            shippingAddress: {},
            paymentMethod: 'COD',

            saveShippingAddress: (data) => set({ shippingAddress: data }),
            savePaymentMethod: (data) => set({ paymentMethod: data })

        }),
        {
            name: 'ecommerce-cart-storage', // unique name for localStorage key
        }
    )
);

export default useCartStore;
