// Booking management and display

document.addEventListener('DOMContentLoaded', function() {
    renderBookings();
    setupMonthFilter();
});

function renderBookings(selectedMonth = null) {
    const bookings = Storage.getBookings();
    const container = document.getElementById('bookings-container');
    
    if (!container) return;

    let filteredBookings = bookings;

    // Filter by month if selected
    if (selectedMonth) {
        const [year, month] = selectedMonth.split('-').map(Number);
        filteredBookings = Storage.getBookingsByMonth(year, month);
    }

    // Sort by booking date (newest first)
    filteredBookings.sort((a, b) => {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
    });

    if (filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings">
                <p>No bookings found for the selected period.</p>
            </div>
        `;
        return;
    }

    // Group bookings by month for better display
    const groupedBookings = groupBookingsByMonth(filteredBookings);

    container.innerHTML = Object.keys(groupedBookings).map(month => {
        const monthBookings = groupedBookings[month];
        return `
            <div class="month-section">
                <h3 class="month-header">${formatMonth(month)}</h3>
                <div class="bookings-grid">
                    ${monthBookings.map(booking => createBookingCard(booking)).join('')}
                </div>
            </div>
        `;
    }).join('');

    // Add event listeners for status updates
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const bookingId = this.getAttribute('data-booking-id');
            const newStatus = this.value;
            updateBookingStatus(bookingId, newStatus);
        });
    });
}

function createBookingCard(booking) {
    const pkg = Storage.getPackageById(booking.packageId);
    const packageName = pkg ? pkg.name : booking.packageName || 'Unknown Package';
    const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
    const travelDate = booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'Not specified';

    const statusColors = {
        'Pending': 'status-pending',
        'Confirmed': 'status-confirmed',
        'Cancelled': 'status-cancelled'
    };

    return `
        <div class="booking-card">
            <div class="booking-header">
                <h4>${packageName}</h4>
                <select class="status-select ${statusColors[booking.status] || ''}" data-booking-id="${booking.id}">
                    <option value="Pending" ${booking.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Confirmed" ${booking.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Cancelled" ${booking.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
            <div class="booking-details">
                <div class="booking-info">
                    <p><strong>Customer:</strong> ${booking.customerName || 'Not specified'}</p>
                    <p><strong>Email:</strong> ${booking.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${booking.phone || 'Not provided'}</p>
                    <p><strong>Booking Date:</strong> ${bookingDate}</p>
                    <p><strong>Travel Date:</strong> ${travelDate}</p>
                </div>
            </div>
            <div class="booking-actions">
                <button class="btn-small btn-delete" onclick="deleteBooking('${booking.id}')">Delete</button>
            </div>
        </div>
    `;
}

function groupBookingsByMonth(bookings) {
    const grouped = {};
    
    bookings.forEach(booking => {
        const date = new Date(booking.travelDate || booking.bookingDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!grouped[monthKey]) {
            grouped[monthKey] = [];
        }
        grouped[monthKey].push(booking);
    });

    // Sort months in descending order
    return Object.keys(grouped)
        .sort((a, b) => b.localeCompare(a))
        .reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
        }, {});
}

function formatMonth(monthKey) {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function setupMonthFilter() {
    const monthFilter = document.getElementById('month-filter');
    if (monthFilter) {
        // Generate month options for current and past 6 months
        const options = ['<option value="">All Months</option>'];
        const today = new Date();
        
        for (let i = 0; i < 12; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            options.push(`<option value="${value}">${label}</option>`);
        }
        
        monthFilter.innerHTML = options.join('');
        
        monthFilter.addEventListener('change', function() {
            renderBookings(this.value || null);
        });
    }
}

function updateBookingStatus(bookingId, newStatus) {
    if (Storage.updateBooking(bookingId, { status: newStatus })) {
        renderBookings(document.getElementById('month-filter')?.value || null);
    } else {
        alert('Error updating booking status');
    }
}

function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) {
        return;
    }

    if (Storage.deleteBooking(bookingId)) {
        renderBookings(document.getElementById('month-filter')?.value || null);
    } else {
        alert('Error deleting booking');
    }
}

function exportBookings() {
    const bookings = Storage.getBookings();
    const monthFilter = document.getElementById('month-filter')?.value;
    
    let filteredBookings = bookings;
    if (monthFilter) {
        const [year, month] = monthFilter.split('-').map(Number);
        filteredBookings = Storage.getBookingsByMonth(year, month);
    }

    // Convert to CSV
    const headers = ['Package Name', 'Customer Name', 'Email', 'Phone', 'Booking Date', 'Travel Date', 'Status'];
    const rows = filteredBookings.map(booking => {
        const pkg = Storage.getPackageById(booking.packageId);
        return [
            pkg ? pkg.name : booking.packageName || 'Unknown',
            booking.customerName || '',
            booking.email || '',
            booking.phone || '',
            new Date(booking.bookingDate).toLocaleDateString(),
            booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : '',
            booking.status || 'Pending'
        ];
    });

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${monthFilter || 'all'}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
