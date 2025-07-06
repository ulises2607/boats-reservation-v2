import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AdminBoats = () => {
  const { token } = useSelector((state) => state.auth);
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingBoat, setEditingBoat] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchBoats();
  }, [page, searchTerm]);

  const fetchBoats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`http://localhost:3001/api/v1/admin/boats?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setBoats(data.status.data.boats);
        setTotalPages(data.status.data.pagination.total_pages);
      } else {
        setError(data.status.message || 'Error loading boats');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (boat) => {
    setEditingBoat(boat.id);
    setFormData({
      name: boat.name,
      description: boat.description,
      price: boat.price,
      location: boat.location,
      capacity: boat.capacity
    });
  };

  const handleSave = async (boatId) => {
    try {
      // Note: Using the regular boats endpoint since admin controller doesn't have boat update
      const response = await fetch(`http://localhost:3001/api/v1/boats/${boatId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boat: formData }),
      });

      if (response.ok) {
        setEditingBoat(null);
        fetchBoats();
      } else {
        const data = await response.json();
        setError(data.status.message || 'Error updating boat');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handleDelete = async (boatId) => {
    if (!window.confirm('Are you sure you want to delete this boat?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/v1/admin/boats/${boatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchBoats();
      } else {
        const data = await response.json();
        setError(data.status.message || 'Error deleting boat');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setEditingBoat(null);
    setFormData({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBoats();
  };

  if (loading && boats.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Boat Management</h1>
        <p className="text-gray-600">Manage platform boats</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search boats by name, location, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Boats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {boats.map((boat) => (
          <div key={boat.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Boat Image */}
            <div className="h-48 bg-gray-200 relative">
              {boat.picture ? (
                <img 
                  src={boat.picture} 
                  alt={boat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Boat Content */}
            <div className="p-6">
              {editingBoat === boat.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Boat name"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20"
                  />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Location"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Price"
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      placeholder="Capacity"
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSave(boat.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{boat.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{boat.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {boat.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                      </svg>
                      Capacity: {boat.capacity} people
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Owner: {boat.owner.name}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">${boat.price}</span>
                    <span className="text-sm text-gray-500">
                      Created: {new Date(boat.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(boat)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(boat.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {boats.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No boats found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No boats have been created yet.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBoats;
