import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Layers,
  Check,
  X,
} from 'lucide-react';
import { Category } from '../../types';

export const CategoriesPage: React.FC = () => {
  const { navigate } = useRouter();
  const { categories, products, currentTenant, addCategory, updateCategory, deleteCategory } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setParentId(null);
    setDescription('');
    setImage('https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentId(cat.parentId || null);
    setDescription(cat.description || '');
    setImage(cat.image);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        slug,
        parentId: parentId || null,
        description,
        image,
      });
    } else {
      addCategory({
        name,
        slug,
        parentId: parentId || null,
        description,
        image,
        productCount: 0,
        visibility: 'visible',
        status: 'active',
      });
    }
    setModalOpen(false);
  };

  // Group root categories and their subcategories
  const rootCategories = categories.filter((c) => !c.parentId);

  const getSubcategories = (parentCatId: string) => {
    return categories.filter((c) => c.parentId === parentCatId);
  };

  const getProductCount = (catId: string) => {
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Category Hierarchy & Taxonomies</h1>
          <p className="text-xs text-neutral-500">
            Organize products into hierarchical departments for easy customer navigation.
          </p>
        </div>

        <button
          id="category-add-btn"
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Hierarchy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rootCategories.map((root) => {
          const subs = getSubcategories(root.id);
          const count = getProductCount(root.id);

          return (
            <div key={root.id} className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                {/* Header with image */}
                <div className="relative h-32 bg-neutral-100 overflow-hidden">
                  <img src={root.image} alt={root.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3.5">
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-tight">{root.name}</h2>
                      <span className="text-[11px] text-neutral-200">
                        {count} direct product{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(root)}
                      className="p-1.5 bg-white/90 hover:bg-white text-neutral-800 rounded-md text-xs shadow-xs"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete category "${root.name}"?`)) deleteCategory(root.id);
                      }}
                      className="p-1.5 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-md text-xs shadow-xs"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories list */}
                <div className="p-3.5">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Subcategories ({subs.length})
                  </div>

                  {subs.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic py-1">No nested subcategories.</p>
                  ) : (
                    <div className="space-y-2">
                      {subs.map((sub) => {
                        const subCount = getProductCount(sub.id);
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-100 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400 font-mono text-[10px]">↳</span>
                              <span className="font-semibold text-neutral-800">{sub.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-neutral-500 font-medium">
                                {subCount} item{subCount !== 1 ? 's' : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => openEditModal(sub)}
                                className="p-1 text-neutral-400 hover:text-neutral-800"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-500">Slug: /{root.slug}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/store/${currentTenant.slug}/category/${root.slug}`)}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 text-[11px]"
                >
                  View on Store →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingCategory ? `Edit Category` : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart Wearables"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Parent Category (Optional for Hierarchy)
                </label>
                <select
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value || null)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="">None (Top Level Category)</option>
                  {rootCategories
                    .filter((rc) => !editingCategory || rc.id !== editingCategory.id)
                    .map((rc) => (
                      <option key={rc.id} value={rc.id}>
                        {rc.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
