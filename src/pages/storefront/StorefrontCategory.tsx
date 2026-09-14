import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Star,
  MessageSquare,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Product } from '../../types';

interface StorefrontCategoryProps {
  onOpenCart: () => void;
}

export const StorefrontCategory: React.FC<StorefrontCategoryProps> = ({ onOpenCart }) => {
  const { params, navigate } = useRouter();
  const { categories, products, currentTenant, addToCart, b2bModeActive } = useStore();

  const category = categories.find((c) => c.slug === params.categorySlug);

  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');

  if (!category) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-base font-bold text-neutral-900">Category Not Found</h2>
        <button
          type="button"
          onClick={() => navigate(`/store/${currentTenant.slug}`)}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const categoryProducts = products
    .filter((p) => p.category === category.id && p.status === 'active')
    .sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      if (sortBy === 'price_low') return priceA - priceB;
      if (sortBy === 'price_high') return priceB - priceA;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <button
          type="button"
          onClick={() => navigate(`/store/${currentTenant.slug}`)}
          className="hover:text-neutral-900"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-900 font-semibold">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">{category.name}</h1>
          <p className="text-xs text-neutral-500 mt-0.5">{category.description}</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-neutral-500">{categoryProducts.length} items found</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
          >
            <option value="featured">Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoryProducts.map((p) => {
          const price = b2bModeActive && p.wholesalePrice ? p.wholesalePrice : p.salePrice || p.price;
          return (
            <div
              key={p.id}
              onClick={() => navigate(`/store/${currentTenant.slug}/product/${p.slug}`)}
              className="group bg-white rounded-xl border border-neutral-200 overflow-hidden p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] text-neutral-400 font-semibold">{p.brand}</span>
                  <h3 className="text-xs font-bold text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-xs font-bold text-neutral-900">₹{price.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p, 1);
                  onOpenCart();
                }}
                className="w-full mt-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
