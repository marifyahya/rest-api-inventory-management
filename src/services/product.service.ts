const products = [
  { id: 1, name: "Laptop", price: 23000000, stock: 10 },
  { id: 2, name: "Mouse", price: 900000, stock: 100 },
  { id: 3, name: "Keyboard", price: 1200000, stock: 50 },
];

class ProductService {
  getAll() {
    return products;
  }

  getById(id: number) {
    return products.find((p) => p.id === id);
  }

  create(payload: { name: string, price: number, stock: number }) {
    const id = products.length + 1;
    const product = { id, ...payload };
    products.push(product);

    return product;
  }
}

export const productService = new ProductService();
