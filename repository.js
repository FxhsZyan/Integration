/**
 * InventoryRepository
 * ---------------------------------------------------------
 * This is the "repository" layer required by the exercise.
 * It's the ONLY place that knows how data is actually stored
 * (right now: localStorage). Every page talks to this object,
 * never to localStorage directly.
 *
 * Swap this file alone (keep the same method names) and every
 * page keeps working — e.g. point getAll()/add()/update()/remove()
 * at a real fetch() call to a backend API later.
 */
const InventoryRepository = (() => {
  const STORAGE_KEY = "stockroom_products";

  function readAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function writeAll(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  function seedIfEmpty() {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const seed = [
      { id: crypto.randomUUID(), name: "Steel Bolt M8x40",     sku: "HW-1001", category: "Hardware",   quantity: 240, reorderLevel: 50,  unitPrice: 3.50  },
      { id: crypto.randomUUID(), name: "Cable Tie 200mm",      sku: "HW-1042", category: "Hardware",   quantity: 18,  reorderLevel: 30,  unitPrice: 0.75  },
      { id: crypto.randomUUID(), name: "USB-C Cable 1m",       sku: "EL-2005", category: "Electronics", quantity: 64,  reorderLevel: 20,  unitPrice: 89.00 },
      { id: crypto.randomUUID(), name: "A4 Bond Paper (Ream)", sku: "OF-3010", category: "Office",     quantity: 12,  reorderLevel: 15,  unitPrice: 175.00 },
      { id: crypto.randomUUID(), name: "Ballpoint Pen (Box)",  sku: "OF-3021", category: "Office",     quantity: 90,  reorderLevel: 25,  unitPrice: 60.00 }
    ];
    writeAll(seed);
  }

  function getAll() {
    return readAll().sort((a, b) => a.name.localeCompare(b.name));
  }

  function getById(id) {
    return readAll().find(p => p.id === id) || null;
  }

  function add(product) {
    const products = readAll();
    const newProduct = { id: crypto.randomUUID(), ...product };
    products.push(newProduct);
    writeAll(products);
    return newProduct;
  }

  function update(id, updates) {
    const products = readAll();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates, id };
    writeAll(products);
    return products[idx];
  }

  function remove(id) {
    const products = readAll().filter(p => p.id !== id);
    writeAll(products);
  }

  function stats() {
    const products = readAll();
    const totalItems = products.length;
    const totalUnits = products.reduce((sum, p) => sum + Number(p.quantity), 0);
    const totalValue = products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.unitPrice), 0);
    const lowStock = products.filter(p => Number(p.quantity) <= Number(p.reorderLevel));
    return { totalItems, totalUnits, totalValue, lowStock };
  }

  seedIfEmpty();

  return { getAll, getById, add, update, remove, stats };
})();
