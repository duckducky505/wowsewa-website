import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchHook } from "../../hooks/fetchHook";
import "./InventoryManagement.css";

const emptyProductForm = {
  name: "",
  sku: "",
  category: "",
  unit: "pcs",
  costPrice: "",
  sellingPrice: "",
  quantity: "",
  reorderLevel: "",
  supplier: "",
};

const emptyStockForm = {
  productId: "",
  type: "in",
  quantity: "",
  reason: "",
};

const InventoryManagement = () => {
  const { user } = useAuth();
  const fetchAPI = fetchHook();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all"); // all | low | out

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [savingProduct, setSavingProduct] = useState(false);

  const [showStockModal, setShowStockModal] = useState(false);
  const [stockForm, setStockForm] = useState(emptyStockForm);
  const [savingStock, setSavingStock] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/inventory/products", { method: "GET" });
      setProducts(res?.data ?? []);
    } catch (err) {
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }, [fetchAPI]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchAPI("/api/inventory/categories", { method: "GET" });
      setCategories(res?.data ?? []);
    } catch (err) {
      // non-blocking
    }
  }, [fetchAPI]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  // ===== PRODUCT FORM =====
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      category: product.category ?? "",
      unit: product.unit ?? "pcs",
      costPrice: product.costPrice ?? "",
      sellingPrice: product.sellingPrice ?? "",
      quantity: product.quantity ?? "",
      reorderLevel: product.reorderLevel ?? "",
      supplier: product.supplier ?? "",
    });
    setShowProductModal(true);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!productForm.name.trim() || !productForm.sku.trim()) {
      setError("Product name and SKU are required.");
      return;
    }
    if (Number(productForm.sellingPrice) <= 0) {
      setError("Selling price must be greater than zero.");
      return;
    }

    setSavingProduct(true);
    try {
      const payload = {
        ...productForm,
        costPrice: Number(productForm.costPrice) || 0,
        sellingPrice: Number(productForm.sellingPrice),
        quantity: Number(productForm.quantity) || 0,
        reorderLevel: Number(productForm.reorderLevel) || 0,
        updatedBy: user?.guidId,
      };

      if (editingProduct) {
        await fetchAPI(`/api/inventory/products/${editingProduct.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAPI("/api/inventory/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setShowProductModal(false);
      await loadProducts();
    } catch (err) {
      setError("Failed to save product. Please try again.");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Remove this product from inventory?")) return;
    try {
      await fetchAPI(`/api/inventory/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  // ===== STOCK ADJUSTMENT =====
  const openStockModal = (product, type = "in") => {
    setStockForm({ productId: product.id, type, quantity: "", reason: "" });
    setShowStockModal(true);
  };

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setStockForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!stockForm.quantity || Number(stockForm.quantity) <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    setSavingStock(true);
    try {
      await fetchAPI("/api/inventory/stock-adjustments", {
        method: "POST",
        body: JSON.stringify({
          ...stockForm,
          quantity: Number(stockForm.quantity),
          adjustedBy: user?.guidId,
        }),
      });
      setShowStockModal(false);
      await loadProducts();
    } catch (err) {
      setError("Failed to record stock adjustment.");
    } finally {
      setSavingStock(false);
    }
  };

  // ===== DERIVED DATA =====
  const stockStatus = (product) => {
    if (Number(product.quantity) <= 0) return "out";
    if (Number(product.quantity) <= Number(product.reorderLevel)) return "low";
    return "ok";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || p.category === filterCategory;
      const status = stockStatus(p);
      const matchesStock =
        filterStock === "all" ||
        (filterStock === "low" && status === "low") ||
        (filterStock === "out" && status === "out");
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, filterCategory, filterStock]);

  const totalStockValue = products.reduce(
    (sum, p) => sum + Number(p.costPrice || 0) * Number(p.quantity || 0),
    0
  );
  const lowStockCount = products.filter((p) => stockStatus(p) === "low").length;
  const outOfStockCount = products.filter((p) => stockStatus(p) === "out").length;

  return (
    <div className="inv-mgmt">
      <header className="inv-mgmt__header">
        <div className="inv-mgmt__header-inner">
          <span className="inv-mgmt__eyebrow">WowSewa · Front Desk Ledger</span>
          <h1 className="inv-mgmt__title">Inventory Management</h1>
          <p className="inv-mgmt__subtitle">
            Track stock levels, pricing, and supplier details for shop products.
          </p>
        </div>
        <button className="inv-mgmt__add-btn" onClick={openAddProduct}>
          + Add Product
        </button>
      </header>

      <div className="inv-mgmt__body">
        <section className="inv-mgmt__summary">
          <div className="inv-summary-card">
            <span className="inv-summary-card__label">Total Products</span>
            <span className="inv-summary-card__value">{products.length}</span>
          </div>
          <div className="inv-summary-card">
            <span className="inv-summary-card__label">Stock Value</span>
            <span className="inv-summary-card__value">
              Rs. {totalStockValue.toLocaleString()}
            </span>
          </div>
          <div className="inv-summary-card inv-summary-card--warn">
            <span className="inv-summary-card__label">Low Stock</span>
            <span className="inv-summary-card__value">{lowStockCount}</span>
          </div>
          <div className="inv-summary-card inv-summary-card--danger">
            <span className="inv-summary-card__label">Out of Stock</span>
            <span className="inv-summary-card__value">{outOfStockCount}</span>
          </div>
        </section>

        <section className="inv-panel">
          <div className="inv-panel__toolbar">
            <input
              type="text"
              className="inv-filters__search"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="inv-filters">
              <select
                className="inv-filters__select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id ?? cat} value={cat.name ?? cat}>
                    {cat.name ?? cat}
                  </option>
                ))}
              </select>
              <select
                className="inv-filters__select"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="all">All Stock Levels</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          {error && <p className="inv-panel__error">{error}</p>}

          {loading ? (
            <p className="inv-panel__state">Loading inventory...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="inv-panel__state">No products found.</p>
          ) : (
            <div className="inv-table-wrap">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th className="inv-table__num-col">Cost Price</th>
                    <th className="inv-table__num-col">Selling Price</th>
                    <th className="inv-table__num-col">Qty</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = stockStatus(product);
                    return (
                      <tr key={product.id}>
                        <td className="inv-table__sku">{product.sku}</td>
                        <td>
                          <div className="inv-table__product-name">{product.name}</div>
                          {product.supplier && (
                            <div className="inv-table__supplier">{product.supplier}</div>
                          )}
                        </td>
                        <td>{product.category || "—"}</td>
                        <td className="inv-table__num-col">
                          Rs. {Number(product.costPrice).toLocaleString()}
                        </td>
                        <td className="inv-table__num-col">
                          Rs. {Number(product.sellingPrice).toLocaleString()}
                        </td>
                        <td className="inv-table__num-col">
                          {product.quantity} {product.unit}
                        </td>
                        <td>
                          <span className={`inv-badge inv-badge--${status}`}>
                            {status === "ok" ? "In Stock" : status === "low" ? "Low Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="inv-table__actions">
                          <button
                            className="inv-icon-btn inv-icon-btn--in"
                            onClick={() => openStockModal(product, "in")}
                            title="Stock In"
                          >
                            ▲
                          </button>
                          <button
                            className="inv-icon-btn inv-icon-btn--out"
                            onClick={() => openStockModal(product, "out")}
                            title="Stock Out"
                          >
                            ▼
                          </button>
                          <button
                            className="inv-icon-btn"
                            onClick={() => openEditProduct(product)}
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            className="inv-icon-btn inv-icon-btn--delete"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ===== PRODUCT MODAL ===== */}
      {showProductModal && (
        <div className="inv-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="inv-modal__header">
              <h2 className="inv-modal__title">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                className="inv-modal__close"
                onClick={() => setShowProductModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="inv-form" onSubmit={handleProductSubmit}>
              <div className="inv-form__row inv-form__row--split">
                <div>
                  <label className="inv-form__label" htmlFor="name">
                    Product Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="inv-form__input"
                    value={productForm.name}
                    onChange={handleProductChange}
                  />
                </div>
                <div>
                  <label className="inv-form__label" htmlFor="sku">
                    SKU
                  </label>
                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    className="inv-form__input"
                    value={productForm.sku}
                    onChange={handleProductChange}
                  />
                </div>
              </div>

              <div className="inv-form__row inv-form__row--split">
                <div>
                  <label className="inv-form__label" htmlFor="category">
                    Category
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    list="category-options"
                    className="inv-form__input"
                    value={productForm.category}
                    onChange={handleProductChange}
                  />
                  <datalist id="category-options">
                    {categories.map((cat) => (
                      <option key={cat.id ?? cat} value={cat.name ?? cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="inv-form__label" htmlFor="unit">
                    Unit
                  </label>
                  <input
                    id="unit"
                    name="unit"
                    type="text"
                    className="inv-form__input"
                    placeholder="pcs, box, litre..."
                    value={productForm.unit}
                    onChange={handleProductChange}
                  />
                </div>
              </div>

              <div className="inv-form__row inv-form__row--split">
                <div>
                  <label className="inv-form__label" htmlFor="costPrice">
                    Cost Price (Rs.)
                  </label>
                  <input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="inv-form__input"
                    value={productForm.costPrice}
                    onChange={handleProductChange}
                  />
                </div>
                <div>
                  <label className="inv-form__label" htmlFor="sellingPrice">
                    Selling Price (Rs.)
                  </label>
                  <input
                    id="sellingPrice"
                    name="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="inv-form__input"
                    value={productForm.sellingPrice}
                    onChange={handleProductChange}
                  />
                </div>
              </div>

              <div className="inv-form__row inv-form__row--split">
                <div>
                  <label className="inv-form__label" htmlFor="quantity">
                    {editingProduct ? "Current Quantity" : "Opening Quantity"}
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    className="inv-form__input"
                    value={productForm.quantity}
                    onChange={handleProductChange}
                    disabled={!!editingProduct}
                  />
                  {editingProduct && (
                    <span className="inv-form__hint">
                      Use Stock In / Stock Out to adjust quantity.
                    </span>
                  )}
                </div>
                <div>
                  <label className="inv-form__label" htmlFor="reorderLevel">
                    Reorder Level
                  </label>
                  <input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    min="0"
                    className="inv-form__input"
                    value={productForm.reorderLevel}
                    onChange={handleProductChange}
                  />
                </div>
              </div>

              <div className="inv-form__row">
                <label className="inv-form__label" htmlFor="supplier">
                  Supplier
                </label>
                <input
                  id="supplier"
                  name="supplier"
                  type="text"
                  className="inv-form__input"
                  placeholder="Optional"
                  value={productForm.supplier}
                  onChange={handleProductChange}
                />
              </div>

              {error && <p className="inv-form__error">{error}</p>}

              <div className="inv-form__actions">
                <button
                  type="button"
                  className="inv-form__cancel"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="inv-form__submit" disabled={savingProduct}>
                  {savingProduct ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== STOCK ADJUSTMENT MODAL ===== */}
      {showStockModal && (
        <div className="inv-modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="inv-modal inv-modal--small" onClick={(e) => e.stopPropagation()}>
            <div className="inv-modal__header">
              <h2 className="inv-modal__title">
                {stockForm.type === "in" ? "Stock In" : "Stock Out"}
              </h2>
              <button className="inv-modal__close" onClick={() => setShowStockModal(false)}>
                ✕
              </button>
            </div>

            <form className="inv-form" onSubmit={handleStockSubmit}>
              <div className="inv-form__row">
                <label className="inv-form__label">Type</label>
                <div className="inv-toggle">
                  <button
                    type="button"
                    className={`inv-toggle__btn ${stockForm.type === "in" ? "inv-toggle__btn--active" : ""}`}
                    onClick={() => setStockForm((prev) => ({ ...prev, type: "in" }))}
                  >
                    Stock In
                  </button>
                  <button
                    type="button"
                    className={`inv-toggle__btn ${stockForm.type === "out" ? "inv-toggle__btn--active" : ""}`}
                    onClick={() => setStockForm((prev) => ({ ...prev, type: "out" }))}
                  >
                    Stock Out
                  </button>
                </div>
              </div>

              <div className="inv-form__row">
                <label className="inv-form__label" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  className="inv-form__input"
                  value={stockForm.quantity}
                  onChange={handleStockChange}
                />
              </div>

              <div className="inv-form__row">
                <label className="inv-form__label" htmlFor="reason">
                  Reason / Remarks
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  className="inv-form__textarea"
                  rows={2}
                  placeholder={
                    stockForm.type === "in" ? "e.g. New shipment received" : "e.g. Damaged / sold"
                  }
                  value={stockForm.reason}
                  onChange={handleStockChange}
                />
              </div>

              {error && <p className="inv-form__error">{error}</p>}

              <div className="inv-form__actions">
                <button
                  type="button"
                  className="inv-form__cancel"
                  onClick={() => setShowStockModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="inv-form__submit" disabled={savingStock}>
                  {savingStock ? "Saving..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;