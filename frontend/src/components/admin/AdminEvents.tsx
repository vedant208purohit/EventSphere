import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { eventService } from '../../services/eventService';
import { Calendar, Edit, Trash2, Plus, X } from 'lucide-react';
import { Event } from '../../types';
import toast from 'react-hot-toast';

const categories = ['Music', 'Sports', 'Technology', 'Art', 'Food', 'Business', 'Health', 'Education', 'Other'];

const AdminEvents = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Technology', location: '', date: '',
    time: '', price: '', totalSeats: '', organizer: '', image: '', isFeatured: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['events', 'admin-all'],
    queryFn: () => eventService.getEvents({ limit: 50 }),
  });

  // Pagination (client-side)
  const [page, setPage] = useState(1);
  const perPage = 10;
  const events = data?.events || [];
  const total = events.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const eventsPaged = events.slice((page - 1) * perPage, page * perPage);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Event>) => eventService.createEvent(data),
    onSuccess: () => {
      toast.success('Event created');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => eventService.updateEvent(id, data),
    onSuccess: () => {
      toast.success('Event updated');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      toast.success('Event deleted');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const openCreate = () => {
    setEditEvent(null);
    setForm({ title: '', description: '', category: 'Technology', location: '', date: '', time: '', price: '', totalSeats: '', organizer: '', image: '', isFeatured: false });
    setShowModal(true);
  };

  const openEdit = (event: Event) => {
    setEditEvent(event);
    setForm({
      title: event.title, description: event.description, category: event.category,
      location: event.location, date: event.date.substring(0, 10), time: event.time,
      price: String(event.price), totalSeats: String(event.totalSeats), organizer: event.organizer,
      image: event.image, isFeatured: event.isFeatured,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      totalSeats: Number(form.totalSeats),
      availableSeats: editEvent ? undefined : Number(form.totalSeats),
    };

    if (editEvent) {
      updateMutation.mutate({ id: editEvent._id, data: payload as any });
    } else {
      createMutation.mutate(payload as any);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this event?')) deleteMutation.mutate(id);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-surface-50">Events</h1>
          <p className="text-sm text-surface-500 mt-1">{data?.total || 0} total events</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Pagination (top) */}
      <div className="mb-4 p-2 flex items-center justify-between">
        <div className="text-sm text-surface-500">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border hover:bg-surface-100 dark:hover:bg-surface-800/20 disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">{page} / {totalPages}</div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg border hover:bg-surface-100 dark:hover:bg-surface-800/20 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Mobile list */}
        <div className="md:hidden p-4 space-y-3">
          {eventsPaged.map((event) => (
            <div key={event._id} className="p-3 bg-surface-50 dark:bg-surface-800/40 rounded-xl flex items-start justify-between">
              <div className="flex items-start gap-3">
                <img src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 line-clamp-1">{event.title}</p>
                  <p className="text-xs text-surface-400">{event.category} • {formatDate(event.date)}</p>
                  <p className="text-sm font-medium mt-1">₹{event.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(event)} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700">
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Event</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Seats</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {eventsPaged.map((event) => (
                <tr key={event._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 line-clamp-1">{event.title}</p>
                        <p className="text-xs text-surface-400">{event.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="badge-primary">{event.category}</span></td>
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400">{formatDate(event.date)}</td>
                  <td className="px-5 py-4 text-sm font-medium text-surface-900 dark:text-surface-100">₹{event.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400">{event.availableSeats}/{event.totalSeats}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(event)} className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination handled at top */}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">
                {editEvent ? 'Edit Event' : 'Create Event'}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Time</label>
                  <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="09:00 AM" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Total Seats</label>
                  <input type="number" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Organizer</label>
                  <input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">Image URL</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 rounded text-primary-600" />
                  <label htmlFor="featured" className="text-sm font-medium text-surface-600 dark:text-surface-400">Featured Event</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editEvent ? 'Update' : 'Create'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
