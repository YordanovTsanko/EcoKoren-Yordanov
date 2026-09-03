import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalQty: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) existing.qty += 1
      else state.items.push({ ...action.payload, qty: 1 })
      state.totalQty += 1
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
      state.totalQty = state.items.reduce((s,i)=>s+i.qty,0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalQty = 0
    }
  }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
