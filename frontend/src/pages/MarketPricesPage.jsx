/**
 * Market Prices Page for AgriConnect
 */
import React, { useState } from 'react';
import { usePrices, useCrops, useRegions } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Select, Card, PageLoading, EmptyState, PriceChange } from '../components/UI';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarketPricesPage = () => {
  const [filters, setFilters] = useState({
    crop_id: '',
    region_id: '',
  });

  const { data: pricesData, isLoading } = usePrices(filters);
  const { data: crops } = useCrops();
  const { data: regions } = useRegions();

  const cropOptions = crops?.map(c => ({ value: c.id, label: c.name })) || [];
  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];

  const prices = pricesData?.prices || [];

  // Group prices by crop category
  const groupedPrices = prices.reduce((acc, price) => {
    const category = price.crop_category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(price);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="page-title">Market Prices</h1>
          <p className="text-neutral-500 mt-1">
            Current market prices for crops across Botswana
          </p>
        </div>

        {/* Filters */}
        <Card className="flex flex-col md:flex-row gap-4">
          <Select
            label="Filter by Crop"
            value={filters.crop_id}
            onChange={(e) => setFilters(prev => ({ ...prev, crop_id: e.target.value }))}
            options={cropOptions}
            placeholder="All Crops"
            className="md:w-64"
          />
          <Select
            label="Filter by Region"
            value={filters.region_id}
            onChange={(e) => setFilters(prev => ({ ...prev, region_id: e.target.value }))}
            options={regionOptions}
            placeholder="All Regions"
            className="md:w-64"
          />
        </Card>

        {/* Price Legend */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            <span>Price Increased</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown size={18} className="text-red-500" />
            <span>Price Decreased</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus size={18} className="text-neutral-400" />
            <span>No Change</span>
          </div>
        </div>

        {/* Prices Table */}
        {isLoading ? (
          <PageLoading />
        ) : prices.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No prices available"
            description="Market prices will be updated by administrators."
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPrices).map(([category, categoryPrices]) => (
              <Card key={category}>
                <h3 className="section-title mb-4">{category}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-left text-sm text-neutral-500 border-b">
                      <tr>
                        <th className="pb-3 font-medium">Crop</th>
                        <th className="pb-3 font-medium">Region</th>
                        <th className="pb-3 font-medium text-right">Price</th>
                        <th className="pb-3 font-medium text-right">Change</th>
                        <th className="pb-3 font-medium text-right">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categoryPrices.map((price) => (
                        <tr key={price.id} className="hover:bg-neutral-50">
                          <td className="py-3 font-medium">{price.crop_name}</td>
                          <td className="py-3 text-neutral-600">{price.region_name}</td>
                          <td className="py-3 text-right">
                            <span className="font-semibold text-primary-600">
                              P{price.price}
                            </span>
                            <span className="text-neutral-400 text-sm">/{price.unit}</span>
                          </td>
                          <td className="py-3 text-right">
                            <PriceChange change={price.price_change_percent} />
                          </td>
                          <td className="py-3 text-right text-sm text-neutral-500">
                            {new Date(price.updated_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Note */}
        <Card className="bg-primary-50 border border-primary-100">
          <h4 className="font-semibold text-primary-800 mb-2">
            💡 Using Market Prices
          </h4>
          <p className="text-primary-700 text-sm">
            These prices are indicative market rates to help you price your produce competitively.
            Actual prices may vary based on quality, quantity, and direct negotiations with buyers.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default MarketPricesPage;
