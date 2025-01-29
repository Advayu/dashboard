import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  name: string;
  productId: string;
  category: string;
  quantity: number;
  price: number;
  productImage: string | "";
  outletName: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product;
  previewImages: { file: File; preview: string }[];
}

const initialState: ProductState = {
  products: [],
  currentProduct: { name: "", productId: "", category: "", quantity: 0, price: 0, productImage: "", outletName: "" },
  previewImages: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // setCurrentProduct: (state, action: PayloadAction<Product>) => {
    //   state.currentProduct = action.payload;
    // },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    setPreviewImages: (state, action: PayloadAction<{ file: File; preview: string }[]>) => {
      state.previewImages = action.payload;
    },
    removePreviewImage: (state, action: PayloadAction<number>) => {
      state.previewImages = state.previewImages.filter((_, index) => index !== action.payload);
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((_, index) => index !== action.payload);
    }
  },
});

export const { addProduct, setPreviewImages, removePreviewImage, removeProduct } = productSlice.actions;
export type { Product };
export default productSlice.reducer;