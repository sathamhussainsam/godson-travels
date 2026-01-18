// Admin panel CRUD operations

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    setupAdminForm();
    renderAdminPackages();
});

let editingPackageId = null;

function checkAdminAccess() {
    // Simple password protection (can be enhanced later)
    const storedPassword = sessionStorage.getItem('adminAuthenticated');
    if (!storedPassword) {
        const password = prompt('Enter admin password (default: admin123):');
        if (password === 'admin123' || password === 'admin') {
            sessionStorage.setItem('adminAuthenticated', 'true');
        } else {
            alert('Access denied');
            window.location.href = 'index.html';
        }
    }
}

function setupAdminForm() {
    const form = document.getElementById('package-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        savePackage();
    });

    // Image input handling (for multiple images)
    const imageInput = document.getElementById('package-images');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            displayImagePreview(this.files);
        });
    }

    // Reset form button
    const resetBtn = document.getElementById('reset-form');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetForm();
        });
    }
}

function savePackage() {
    const form = document.getElementById('package-form');
    const formData = new FormData(form);
    
    const packageData = {
        name: formData.get('name') || document.getElementById('package-name').value,
        type: formData.get('type') || document.getElementById('package-type').value,
        destination: formData.get('destination') || document.getElementById('package-destination').value,
        price: parseFloat(formData.get('price') || document.getElementById('package-price').value),
        duration: formData.get('duration') || document.getElementById('package-duration').value,
        description: formData.get('description') || document.getElementById('package-description').value,
        itinerary: getItineraryItems(),
        images: getImagePaths()
    };

    // Validation
    if (!packageData.name || !packageData.type || !packageData.destination || !packageData.price) {
        alert('Please fill in all required fields');
        return;
    }

    if (editingPackageId) {
        // Update existing package
        if (Storage.updatePackage(editingPackageId, packageData)) {
            alert('Package updated successfully!');
            resetForm();
            renderAdminPackages();
        } else {
            alert('Error updating package');
        }
    } else {
        // Add new package
        const newPackage = Storage.addPackage(packageData);
        if (newPackage) {
            alert('Package added successfully!');
            resetForm();
            renderAdminPackages();
        } else {
            alert('Error adding package');
        }
    }
}

function getItineraryItems() {
    const items = [];
    const itineraryInput = document.getElementById('package-itinerary');
    if (itineraryInput && itineraryInput.value.trim()) {
        items.push(...itineraryInput.value.split('\n').filter(item => item.trim()));
    }
    return items;
}

function getImagePaths() {
    const images = [];
    const imageInput = document.getElementById('package-images-text');
    if (imageInput && imageInput.value.trim()) {
        images.push(...imageInput.value.split('\n').filter(img => img.trim()));
    }
    return images;
}

function renderAdminPackages() {
    const packages = Storage.getPackages();
    const container = document.getElementById('packages-list');
    
    if (!container) return;

    if (packages.length === 0) {
        container.innerHTML = '<p class="no-data">No packages found. Add your first package!</p>';
        return;
    }

    container.innerHTML = `
        <table class="packages-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Destination</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${packages.map(pkg => `
                    <tr>
                        <td>${pkg.name}</td>
                        <td><span class="badge">${pkg.type}</span></td>
                        <td>${pkg.destination}</td>
                        <td>₹${pkg.price.toLocaleString()}</td>
                        <td>${pkg.duration || 'N/A'}</td>
                        <td>
                            <button class="btn-edit" onclick="editPackage('${pkg.id}')">Edit</button>
                            <button class="btn-delete" onclick="deletePackage('${pkg.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editPackage(id) {
    const pkg = Storage.getPackageById(id);
    if (!pkg) return;

    editingPackageId = id;

    // Populate form
    document.getElementById('package-name').value = pkg.name || '';
    document.getElementById('package-type').value = pkg.type || '';
    document.getElementById('package-destination').value = pkg.destination || '';
    document.getElementById('package-price').value = pkg.price || '';
    document.getElementById('package-duration').value = pkg.duration || '';
    document.getElementById('package-description').value = pkg.description || '';
    document.getElementById('package-itinerary').value = pkg.itinerary ? pkg.itinerary.join('\n') : '';
    document.getElementById('package-images-text').value = pkg.images ? pkg.images.join('\n') : '';

    // Update form title
    const formTitle = document.querySelector('#package-form-section h2');
    if (formTitle) {
        formTitle.textContent = 'Edit Package';
    }

    // Scroll to form
    document.getElementById('package-form-section').scrollIntoView({ behavior: 'smooth' });
}

function deletePackage(id) {
    if (!confirm('Are you sure you want to delete this package?')) {
        return;
    }

    if (Storage.deletePackage(id)) {
        alert('Package deleted successfully!');
        renderAdminPackages();
        if (editingPackageId === id) {
            resetForm();
        }
    } else {
        alert('Error deleting package');
    }
}

function resetForm() {
    editingPackageId = null;
    document.getElementById('package-form').reset();
    const formTitle = document.querySelector('#package-form-section h2');
    if (formTitle) {
        formTitle.textContent = 'Add New Package';
    }
}

function displayImagePreview(files) {
    // This is a placeholder for future file preview functionality
    // For now, we use text input for image paths
    const preview = document.getElementById('image-preview');
    if (preview) {
        preview.innerHTML = `<p>${files.length} file(s) selected. Enter image paths in the text area below.</p>`;
    }
}

function exportData() {
    const packages = Storage.getPackages();
    const bookings = Storage.getBookings();
    
    const data = {
        packages,
        bookings,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `godson-travels-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.packages) {
                Storage.savePackages(data.packages);
            }
            if (data.bookings) {
                Storage.saveBookings(data.bookings);
            }
            alert('Data imported successfully!');
            renderAdminPackages();
            if (window.location.pathname.includes('bookings')) {
                window.location.reload();
            }
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}
