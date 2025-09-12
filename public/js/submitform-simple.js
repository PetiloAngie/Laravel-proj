// Simple JavaScript version for profile submission form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profile-form');
    const messageDiv = document.getElementById('message');
    const profilesList = document.getElementById('profiles-list');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Load profiles on page load
    loadProfiles();
    
    // Refresh button event listener
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadProfiles);
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                age: formData.get('age')
            };
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            try {
                const response = await fetch('/api/profiles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    messageDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
                    form.reset();
                    // Reload profiles list after successful submission
                    loadProfiles();
                } else {
                    let errorMessage = 'An error occurred while submitting the form.';
                    if (result.errors) {
                        const errors = Object.values(result.errors).flat();
                        errorMessage = `Error: ${errors.join(', ')}`;
                    }
                    messageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
                }
            } catch (error) {
                messageDiv.innerHTML = '<div class="alert alert-danger">Network error occurred. Please try again.</div>';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Profile';
            }
        });
    }
    
    // Function to load and display profiles
    async function loadProfiles() {
        if (!profilesList) return;
        
        // Show loading spinner
        profilesList.innerHTML = `
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading profiles...</p>
            </div>
        `;
        
        try {
            const response = await fetch('/api/profiles');
            const result = await response.json();
            
            if (response.ok && result.profiles) {
                displayProfiles(result.profiles);
            } else {
                profilesList.innerHTML = '<div class="alert alert-danger">Failed to load profiles.</div>';
            }
        } catch (error) {
            profilesList.innerHTML = '<div class="alert alert-danger">Network error while loading profiles.</div>';
        }
    }
    
    // Function to display profiles
    function displayProfiles(profiles) {
        if (profiles.length === 0) {
            profilesList.innerHTML = '<div class="text-muted text-center">No profiles submitted yet.</div>';
            return;
        }
        
        let html = '<div class="list-group">';
        profiles.forEach(profile => {
            const createdAt = new Date(profile.created_at).toLocaleString();
            html += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${profile.first_name} ${profile.last_name}</h6>
                        <small class="text-muted">${createdAt}</small>
                    </div>
                    <p class="mb-1">Age: ${profile.age}</p>
                </div>
            `;
        });
        html += '</div>';
        
        profilesList.innerHTML = html;
    }
});
