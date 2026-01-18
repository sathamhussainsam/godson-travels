// Main application logic for package display and navigation

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderPackages();
    setupFilters();
    setupSearch();
}

function renderPackages(filterType = 'all', searchTerm = '') {
    const packages = Storage.getPackages();
    const packagesContainer = document.getElementById('packages-container');
    
    if (!packagesContainer) return;

    let filteredPackages = packages;

    // Filter by type
    if (filterType !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => 
            pkg.type.toLowerCase() === filterType.toLowerCase()
        );
    }

    // Search filter
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredPackages = filteredPackages.filter(pkg =>
            pkg.name.toLowerCase().includes(term) ||
            pkg.destination.toLowerCase().includes(term) ||
            pkg.description.toLowerCase().includes(term)
        );
    }

    if (filteredPackages.length === 0) {
        packagesContainer.innerHTML = `
            <div class="no-packages">
                <p>No packages found. Please check back later!</p>
            </div>
        `;
        return;
    }

    packagesContainer.innerHTML = filteredPackages.map(pkg => createPackageCard(pkg)).join('');
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const packageId = this.getAttribute('data-id');
            window.location.href = `package-detail.html?id=${packageId}`;
        });
    });
}

function createPackageCard(pkg) {
    const mainImage = pkg.images && pkg.images.length > 0 ? pkg.images[0] : 'images/default.svg';
    
    return `
        <div class="package-card">
            <div class="package-image">
                <img src="${mainImage}" alt="${pkg.name}" onerror="this.src='images/default.svg'">
                <div class="package-badge">${pkg.type}</div>
            </div>
            <div class="package-content">
                <h3>${pkg.name}</h3>
                <div class="package-meta">
                    <span class="destination-badge">${pkg.destination}</span>
                    <span class="duration">${pkg.duration || 'N/A'}</span>
                </div>
                <p class="package-description">${pkg.description.substring(0, 100)}...</p>
                <div class="package-footer">
                    <span class="price">₹${pkg.price.toLocaleString()}</span>
                    <button class="view-details-btn" data-id="${pkg.id}">View Details</button>
                </div>
            </div>
        </div>
    `;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            const searchInput = document.getElementById('search-input');
            const searchTerm = searchInput ? searchInput.value : '';
            renderPackages(filterType, searchTerm);
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const activeFilter = document.querySelector('.filter-btn.active');
            const filterType = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            renderPackages(filterType, this.value);
        });
    }
}

// Function to load package details on package-detail.html
function loadPackageDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    
    if (!packageId) {
        document.getElementById('package-content').innerHTML = '<p>Package not found</p>';
        return;
    }

    const pkg = Storage.getPackageById(packageId);
    
    if (!pkg) {
        document.getElementById('package-content').innerHTML = '<p>Package not found</p>';
        return;
    }

    renderPackageDetails(pkg);
    setupImageGallery(pkg.images || []);
}

function renderPackageDetails(pkg) {
    const container = document.getElementById('package-content');
    
    const itineraryHtml = pkg.itinerary && pkg.itinerary.length > 0
        ? `<div class="itinerary">
            <h3>Itinerary</h3>
            <ul>${pkg.itinerary.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>`
        : '';

    container.innerHTML = `
        <div class="package-detail-header">
            <h1>${pkg.name}</h1>
            <div class="package-info-badges">
                <span class="type-badge">${pkg.type}</span>
                <span class="destination-badge">${pkg.destination}</span>
                <span class="duration-badge">${pkg.duration || 'N/A'}</span>
            </div>
        </div>
        
        <div class="package-gallery" id="package-gallery">
            ${(pkg.images || []).map((img, idx) => 
                `<img src="${img}" alt="${pkg.name} - Image ${idx + 1}" onclick="openLightbox(${idx})" onerror="this.src='images/default.svg'">`
            ).join('')}
        </div>
        
        <div class="package-description-full">
            <h2>About This Package</h2>
            <p>${pkg.description}</p>
        </div>
        
        ${itineraryHtml}
        
        <div class="package-pricing">
            <h2>Pricing</h2>
            <div class="price-display">
                <span class="price-amount">₹${pkg.price.toLocaleString()}</span>
                <span class="price-note">per person</span>
            </div>
        </div>
        
        <div class="booking-section">
            <h2>Book This Package</h2>
            <p>Ready to book? Contact us now!</p>
            <div class="booking-actions">
                <a href="tel:9751764713" class="btn btn-phone">
                    📞 Call: 9751764713
                </a>
                <button class="btn btn-email" onclick="bookPackage('${pkg.id}')">
                    ✉️ Book via Email
                </button>
            </div>
        </div>
    `;
}

function setupImageGallery(images) {
    if (images.length === 0) {
        const gallery = document.getElementById('package-gallery');
        if (gallery) {
            gallery.innerHTML = '<img src="images/default.svg" alt="No images available">';
        }
    }
}

function openLightbox(index) {
    // Simple lightbox functionality
    const pkg = getPackageFromUrl();
    if (!pkg || !pkg.images) return;
    
    const images = pkg.images;
    let currentIndex = index;
    
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
            <img src="${images[currentIndex]}" alt="Gallery Image" id="lightbox-img">
            <button class="lightbox-prev" onclick="changeLightboxImage(-1)">&#10094;</button>
            <button class="lightbox-next" onclick="changeLightboxImage(1)">&#10095;</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Store current index globally for navigation
    window.currentLightboxIndex = currentIndex;
    window.lightboxImages = images;
}

function closeLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (overlay) {
        overlay.remove();
    }
    window.currentLightboxIndex = null;
    window.lightboxImages = null;
}

function changeLightboxImage(direction) {
    if (!window.lightboxImages) return;
    
    window.currentLightboxIndex += direction;
    
    if (window.currentLightboxIndex < 0) {
        window.currentLightboxIndex = window.lightboxImages.length - 1;
    } else if (window.currentLightboxIndex >= window.lightboxImages.length) {
        window.currentLightboxIndex = 0;
    }
    
    const img = document.getElementById('lightbox-img');
    if (img) {
        img.src = window.lightboxImages[window.currentLightboxIndex];
    }
}

function getPackageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    return packageId ? Storage.getPackageById(packageId) : null;
}

function bookPackage(packageId) {
    const pkg = Storage.getPackageById(packageId);
    if (!pkg) return;
    
    // Create booking entry
    Storage.addBooking({
        packageId: pkg.id,
        packageName: pkg.name,
        customerName: 'Customer Inquiry',
        email: '',
        phone: '',
        travelDate: '',
        status: 'Pending'
    });
    
    // Create mailto link
    const subject = encodeURIComponent(`Booking Request: ${pkg.name}`);
    const body = encodeURIComponent(
        `Hello,\n\nI am interested in booking the following package:\n\n` +
        `Package Name: ${pkg.name}\n` +
        `Type: ${pkg.type}\n` +
        `Destination: ${pkg.destination}\n` +
        `Duration: ${pkg.duration}\n` +
        `Price: ₹${pkg.price.toLocaleString()}\n\n` +
        `Please contact me with availability and booking details.\n\n` +
        `Thank you!`
    );
    
    window.location.href = `mailto:godsontravels@outlook.com?subject=${subject}&body=${body}`;
}

// Close lightbox on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
