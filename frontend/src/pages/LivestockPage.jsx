/**
 * Livestock Dashboard Page for AgriConnect
 * Shows farmer's livestock with summary cards and filters
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLivestock, useLivestockSummary, useDeleteLivestock } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { 
  Card, 
  PageLoading, 
  EmptyState, 
  Button,
  Modal,
  Pagination
} from '../components/UI';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Activity,
  Heart,
  AlertTriangle,
  DollarSign,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

// Livestock type icons/emojis
const typeIcons = {
  cattle: '🐄',
  goat: '🐐',
  sheep: '🐑',
  chicken: '🐔',
  pig: '🐷',
  donkey: '🫏',
  horse: '🐴',
  other: '🐾'
};

// Status config
const statusConfig = {
  healthy: { label: 'Healthy', color: 'bg-green-100 text-green-700', icon: Heart },
  sick: { label: 'Sick', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  sold: { label: 'Sold', color: 'bg-blue-100 text-blue-700', icon: DollarSign },
  deceased: { label: 'Deceased', color: 'bg-neutral-100 text-neutral-500', icon: X },
};

const LivestockPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, livestock: null });

  const { data: livestockData, isLoading } = useLivestock({ 
    page, 
    limit: 12,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    search: search || undefined
  });
  const { data: summary } = useLivestockSummary();
  const deleteLivestock = useDeleteLivestock();

  const livestock = livestockData?.livestock || [];
  const totalPages = livestockData?.totalPages || 1;

  const handleDelete = async () => {
    if (!deleteModal.livestock) return;
    
    try {
      await deleteLivestock.mutateAsync(deleteModal.livestock.id);
      toast.success('Livestock record deleted');
      setDeleteModal({ open: false, livestock: null });
    } catch (err) {
      toast.error('Failed to delete livestock');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // Get counts by type from summary
  const getTypeCount = (type) => {
    return summary?.byType?.[type]?.total || 0;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">My Livestock</h1>
            <p className="text-neutral-500 mt-1">
              Track and manage your animals
            </p>
          </div>
          <Link to="/farmer/livestock/add" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle size={20} />
            Add Animal
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {Object.entries(typeIcons).map(([type, icon]) => {
            const count = getTypeCount(type);
            return (
              <button
                key={type}
                onClick={() => {
                  setTypeFilter(typeFilter === type ? '' : type);
                  setPage(1);
                }}
                className={`card text-center p-4 transition-all hover:shadow-md ${
                  typeFilter === type ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                }`}
              >
                <span className="text-3xl">{icon}</span>
                <p className="text-2xl font-bold text-neutral-800 mt-1">{count}</p>
                <p className="text-xs text-neutral-500 capitalize">{type}</p>
              </button>
            );
          })}
        </div>

        {/* Overall Stats */}
        {summary && (
          <Card className="bg-primary-50 border border-primary-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary-600">{summary.total || 0}</p>
                <p className="text-sm text-primary-700">Total Animals</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{summary.byStatus?.healthy || 0}</p>
                <p className="text-sm text-green-700">Healthy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">{summary.byStatus?.sick || 0}</p>
                <p className="text-sm text-red-700">Sick</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{summary.byStatus?.sold || 0}</p>
                <p className="text-sm text-blue-700">Sold</p>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by tag, breed, or location..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setStatusFilter(''); setPage(1); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === '' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Status
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(statusFilter === status ? '' : status); setPage(1); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {(typeFilter || statusFilter || search) && (
            <button
              onClick={() => {
                setTypeFilter('');
                setStatusFilter('');
                setSearch('');
                setPage(1);
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear All
            </button>
          )}
        </Card>

        {/* Livestock List */}
        {isLoading ? (
          <PageLoading />
        ) : livestock.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No livestock found"
            description={typeFilter || statusFilter || search 
              ? "No animals match your filters. Try adjusting your search."
              : "Start tracking your livestock by adding your first animal."
            }
            action={
              <Link to="/farmer/livestock/add" className="btn-primary">
                Add Animal
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {livestock.map((animal) => {
                const status = statusConfig[animal.status] || statusConfig.healthy;
                const StatusIcon = status.icon;
                
                return (
                  <Card key={animal.id} className="hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{typeIcons[animal.type] || typeIcons.other}</span>
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-800 capitalize">
                            {animal.type}
                          </h3>
                          {animal.breed && (
                            <p className="text-sm text-neutral-500">{animal.breed}</p>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-neutral-600">
                      {animal.tag_number && (
                        <div className="flex justify-between">
                          <span>Tag:</span>
                          <span className="font-medium text-neutral-800">{animal.tag_number}</span>
                        </div>
                      )}
                      {animal.age_months && (
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="font-medium text-neutral-800">
                            {animal.age_months >= 12 
                              ? `${Math.floor(animal.age_months / 12)} yr ${animal.age_months % 12} mo`
                              : `${animal.age_months} months`
                            }
                          </span>
                        </div>
                      )}
                      {animal.weight_kg && (
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="font-medium text-neutral-800">{animal.weight_kg} kg</span>
                        </div>
                      )}
                      {animal.gender && (
                        <div className="flex justify-between">
                          <span>Gender:</span>
                          <span className="font-medium text-neutral-800 capitalize">{animal.gender}</span>
                        </div>
                      )}
                      {animal.location && (
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium text-neutral-800">{animal.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/farmer/livestock/${animal.id}`)}
                        className="flex-1"
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/farmer/livestock/${animal.id}/edit`)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteModal({ open: true, livestock: animal })}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, livestock: null })}
          title="Delete Livestock"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-500 shrink-0" size={24} />
              <p className="text-sm text-red-800">
                Are you sure you want to delete this livestock record? This will also delete all associated events.
              </p>
            </div>

            {deleteModal.livestock && (
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeIcons[deleteModal.livestock.type] || typeIcons.other}</span>
                  <div>
                    <p className="font-medium text-neutral-800 capitalize">{deleteModal.livestock.type}</p>
                    {deleteModal.livestock.tag_number && (
                      <p className="text-sm text-neutral-500">Tag: {deleteModal.livestock.tag_number}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ open: false, livestock: null })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                loading={deleteLivestock.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default LivestockPage;
