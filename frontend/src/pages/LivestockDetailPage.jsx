/**
 * Livestock Detail Page for AgriConnect
 * Shows animal details and event history
 */
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  useLivestockDetail, 
  useLivestockEvents, 
  useDeleteLivestock,
  useAddLivestockEvent 
} from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, Button, PageLoading, EmptyState, Modal } from '../components/UI';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  PlusCircle,
  Calendar,
  Activity,
  Heart,
  AlertTriangle,
  DollarSign,
  X,
  Syringe,
  Stethoscope,
  Weight,
  Baby,
  MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

// Livestock type icons
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

// Event type config
const eventTypeConfig = {
  vaccination: { label: 'Vaccination', icon: Syringe, color: 'text-blue-600 bg-blue-100' },
  illness: { label: 'Illness', icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
  treatment: { label: 'Treatment', icon: Stethoscope, color: 'text-green-600 bg-green-100' },
  sale: { label: 'Sale', icon: DollarSign, color: 'text-purple-600 bg-purple-100' },
  death: { label: 'Death', icon: X, color: 'text-neutral-600 bg-neutral-100' },
  weight_update: { label: 'Weight Update', icon: Weight, color: 'text-orange-600 bg-orange-100' },
  breeding: { label: 'Breeding', icon: Heart, color: 'text-pink-600 bg-pink-100' },
  birth: { label: 'Birth', icon: Baby, color: 'text-cyan-600 bg-cyan-100' },
  other: { label: 'Other', icon: MoreHorizontal, color: 'text-neutral-600 bg-neutral-100' },
};

// Event types for form
const eventTypes = [
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'illness', label: 'Illness' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'weight_update', label: 'Weight Update' },
  { value: 'breeding', label: 'Breeding' },
  { value: 'birth', label: 'Birth' },
  { value: 'sale', label: 'Sale' },
  { value: 'death', label: 'Death' },
  { value: 'other', label: 'Other' },
];

const LivestockDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: livestock, isLoading } = useLivestockDetail(id);
  const { data: events, isLoading: eventsLoading } = useLivestockEvents(id);
  const deleteLivestock = useDeleteLivestock();
  const addEvent = useAddLivestockEvent();

  const [deleteModal, setDeleteModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    event_type: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
  });

  const handleDelete = async () => {
    try {
      await deleteLivestock.mutateAsync(parseInt(id));
      toast.success('Livestock deleted successfully');
      navigate('/farmer/livestock');
    } catch (err) {
      toast.error('Failed to delete livestock');
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!eventForm.event_type) {
      toast.error('Please select an event type');
      return;
    }

    try {
      await addEvent.mutateAsync({
        id: parseInt(id),
        data: eventForm,
      });
      toast.success('Event recorded successfully');
      setEventModal(false);
      setEventForm({
        event_type: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      toast.error('Failed to record event');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <PageLoading />
      </Layout>
    );
  }

  if (!livestock) {
    return (
      <Layout>
        <EmptyState
          icon={Activity}
          title="Livestock not found"
          description="This animal record doesn't exist or you don't have access to it."
          action={
            <Link to="/farmer/livestock" className="btn-primary">
              Back to Livestock
            </Link>
          }
        />
      </Layout>
    );
  }

  const status = statusConfig[livestock.status] || statusConfig.healthy;
  const StatusIcon = status.icon;

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/farmer/livestock')}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{typeIcons[livestock.type] || typeIcons.other}</span>
              <div>
                <h1 className="page-title capitalize">{livestock.type}</h1>
                {livestock.breed && (
                  <p className="text-neutral-500">{livestock.breed}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
              <StatusIcon size={16} />
              {status.label}
            </span>
            <Button
              variant="outline"
              onClick={() => navigate(`/farmer/livestock/${id}/edit`)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteModal(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Animal Details */}
          <Card className="lg:col-span-1">
            <h2 className="font-semibold text-lg text-neutral-800 mb-4">Animal Details</h2>
            <div className="space-y-4">
              {livestock.tag_number && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-neutral-500">Tag Number</span>
                  <span className="font-medium text-neutral-800">{livestock.tag_number}</span>
                </div>
              )}
              {livestock.gender && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-neutral-500">Gender</span>
                  <span className="font-medium text-neutral-800 capitalize">{livestock.gender}</span>
                </div>
              )}
              {livestock.age_months && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-neutral-500">Age</span>
                  <span className="font-medium text-neutral-800">
                    {livestock.age_months >= 12 
                      ? `${Math.floor(livestock.age_months / 12)} years ${livestock.age_months % 12} months`
                      : `${livestock.age_months} months`
                    }
                  </span>
                </div>
              )}
              {livestock.weight_kg && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-neutral-500">Weight</span>
                  <span className="font-medium text-neutral-800">{livestock.weight_kg} kg</span>
                </div>
              )}
              {livestock.location && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-neutral-500">Location</span>
                  <span className="font-medium text-neutral-800">{livestock.location}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-neutral-500">Added</span>
                <span className="font-medium text-neutral-800">{formatDate(livestock.created_at)}</span>
              </div>
              {livestock.notes && (
                <div className="pt-2">
                  <span className="text-neutral-500 text-sm">Notes</span>
                  <p className="text-neutral-800 mt-1">{livestock.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Event History */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-neutral-800">Event History</h2>
              <Button
                size="sm"
                onClick={() => setEventModal(true)}
              >
                <PlusCircle size={16} className="mr-1" />
                Add Event
              </Button>
            </div>

            {eventsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : !events || events.length === 0 ? (
              <div className="text-center py-8">
                <Activity size={48} className="mx-auto text-neutral-300 mb-3" />
                <p className="text-neutral-500">No events recorded yet</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Record vaccinations, health checks, and other events
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventConfig = eventTypeConfig[event.event_type] || eventTypeConfig.other;
                  const EventIcon = eventConfig.icon;
                  
                  return (
                    <div key={event.id} className="flex gap-4 p-4 bg-neutral-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${eventConfig.color}`}>
                        <EventIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-neutral-800">{eventConfig.label}</h4>
                          <span className="text-sm text-neutral-500">
                            {formatDate(event.event_date)}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-neutral-600 mt-1">{event.description}</p>
                        )}
                        {event.recorded_by_name && (
                          <p className="text-xs text-neutral-400 mt-2">
                            Recorded by {event.recorded_by_name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="Delete Livestock"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-500 shrink-0" size={24} />
              <p className="text-sm text-red-800">
                Are you sure you want to delete this livestock record? This will also delete all associated events. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal(false)}
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

        {/* Add Event Modal */}
        <Modal
          isOpen={eventModal}
          onClose={() => setEventModal(false)}
          title="Record Event"
          size="md"
        >
          <form onSubmit={handleAddEvent} className="space-y-4">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={eventForm.event_type}
                onChange={(e) => setEventForm(prev => ({ ...prev, event_type: e.target.value }))}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select event type...</option>
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={eventForm.event_date}
                onChange={(e) => setEventForm(prev => ({ ...prev, event_date: e.target.value }))}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Enter details about this event..."
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              {eventForm.event_type === 'weight_update' && (
                <p className="text-xs text-neutral-500 mt-1">
                  Tip: Include the weight like "Updated weight to 350 kg"
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEventModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={addEvent.isPending}
                className="flex-1"
              >
                Record Event
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default LivestockDetailPage;
