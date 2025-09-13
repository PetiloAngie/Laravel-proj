import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const SubmitForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        age: ''
    });

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [listError, setListError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', age: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('api/profiles', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            setMessage(response.data.message);
            setFormData({
                first_name: '',
                last_name: '',
                age: ''
            });
            // Refresh profiles after successful submission
            fetchProfiles();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = Object.values(error.response.data.errors).flat();
                setMessage(`Error: ${errors.join(', ')}`);
            } else {
                setMessage('An error occurred while submitting the form.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProfiles = async () => {
        try {
            setListLoading(true);
            const res = await axios.get('api/profiles');
            setProfiles(res.data.profiles || []);
            setListError('');
        } catch (err) {
            setListError('Failed to load profiles');
        } finally {
            setListLoading(false);
        }
    };

    const startEdit = (p) => {
        setEditingId(p.id);
        setEditForm({
            first_name: p.first_name || '',
            last_name: p.last_name || '',
            age: String(p.age ?? '')
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ first_name: '', last_name: '', age: '' });
    };

    const saveEdit = async () => {
        if (!editingId) return;
        try {
            const payload = {
                first_name: editForm.first_name,
                last_name: editForm.last_name,
                age: parseInt(editForm.age, 10)
            };
            const res = await axios.put(`api/profiles/${editingId}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            const updated = res.data.profile;
            setProfiles(prev => prev.map(p => (p.id === editingId ? { ...p, ...updated } : p)));
            setMessage('Profile updated successfully!');
            cancelEdit();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const errors = Object.values(err.response.data.errors).flat();
                setMessage(`Error: ${errors.join(', ')}`);
            } else {
                setMessage('Failed to update profile');
            }
        }
    };

    const deleteProfile = async (id) => {
        if (!confirm('Are you sure you want to delete this profile?')) return;
        try {
            await axios.delete(`api/profiles/${id}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            setProfiles(prev => prev.filter(p => p.id !== id));
            setMessage('Profile deleted successfully!');
        } catch (err) {
            setMessage('Failed to delete profile');
        }
    };

    useEffect(() => {
        fetchProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4>Submit Profile</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="first_name" className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="last_name" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="age" className="form-label">Age</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        min="1"
                                        max="150"
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Profile'}
                                </button>
                            </form>

                            {message && (
                                <div className={`alert mt-3 ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Profiles</h4>
                            <button type="button" className="btn btn-sm btn-primary" onClick={fetchProfiles} disabled={listLoading}>
                                {listLoading ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>
                        <div className="card-body">
                            {listError && <div className="alert alert-danger">{listError}</div>}
                            {!listError && listLoading && (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading profiles...</p>
                                </div>
                            )}
                            {!listLoading && profiles.length === 0 && (
                                <div className="text-muted text-center">No profiles submitted yet.</div>
                            )}
                            {!listLoading && profiles.length > 0 && (
                                <div className="list-group">
                                    {profiles.map(p => (
                                        <div className="list-group-item" key={p.id}>
                                            {editingId === p.id ? (
                                                <div>
                                                    <div className="row g-2">
                                                        <div className="col-md-4">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={editForm.first_name}
                                                                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={editForm.last_name}
                                                                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                min="1"
                                                                max="150"
                                                                value={editForm.age}
                                                                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>Save</button>
                                                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="d-flex w-100 justify-content-between align-items-start">
                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <h6 className="mb-1 me-2">{p.first_name} {p.last_name}</h6>
                                                            <small className="text-muted">{new Date(p.created_at).toLocaleString()}</small>
                                                        </div>
                                                        <p className="mb-1">Age: {p.age}</p>
                                                    </div>
                                                    <div className="text-nowrap">
                                                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(p)}>Edit</button>
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProfile(p.id)}>Delete</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Mount the component
if (document.getElementById('app')) {
    ReactDOM.render(<SubmitForm />, document.getElementById('app'));
}

export default SubmitForm;