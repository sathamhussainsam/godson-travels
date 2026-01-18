// LocalStorage utility functions for packages and bookings

const Storage = {
    // Package operations
    getPackages() {
        try {
            const packages = localStorage.getItem('packages');
            return packages ? JSON.parse(packages) : [];
        } catch (error) {
            console.error('Error reading packages:', error);
            return [];
        }
    },

    savePackages(packages) {
        try {
            localStorage.setItem('packages', JSON.stringify(packages));
            return true;
        } catch (error) {
            console.error('Error saving packages:', error);
            return false;
        }
    },

    getPackageById(id) {
        const packages = this.getPackages();
        return packages.find(pkg => pkg.id === id);
    },

    addPackage(packageData) {
        const packages = this.getPackages();
        const newPackage = {
            ...packageData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        packages.push(newPackage);
        return this.savePackages(packages) ? newPackage : null;
    },

    updatePackage(id, updatedData) {
        const packages = this.getPackages();
        const index = packages.findIndex(pkg => pkg.id === id);
        if (index !== -1) {
            packages[index] = { ...packages[index], ...updatedData };
            return this.savePackages(packages);
        }
        return false;
    },

    deletePackage(id) {
        const packages = this.getPackages();
        const filtered = packages.filter(pkg => pkg.id !== id);
        return this.savePackages(filtered);
    },

    // Booking operations
    getBookings() {
        try {
            const bookings = localStorage.getItem('bookings');
            return bookings ? JSON.parse(bookings) : [];
        } catch (error) {
            console.error('Error reading bookings:', error);
            return [];
        }
    },

    saveBookings(bookings) {
        try {
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return true;
        } catch (error) {
            console.error('Error saving bookings:', error);
            return false;
        }
    },

    addBooking(bookingData) {
        const bookings = this.getBookings();
        const newBooking = {
            ...bookingData,
            id: Date.now().toString(),
            bookingDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: bookingData.status || 'Pending'
        };
        bookings.push(newBooking);
        return this.saveBookings(bookings) ? newBooking : null;
    },

    updateBooking(id, updatedData) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(booking => booking.id === id);
        if (index !== -1) {
            bookings[index] = { ...bookings[index], ...updatedData };
            return this.saveBookings(bookings);
        }
        return false;
    },

    deleteBooking(id) {
        const bookings = this.getBookings();
        const filtered = bookings.filter(booking => booking.id !== id);
        return this.saveBookings(filtered);
    },

    getBookingsByMonth(year, month) {
        const bookings = this.getBookings();
        return bookings.filter(booking => {
            const date = new Date(booking.travelDate || booking.bookingDate);
            return date.getFullYear() === year && date.getMonth() === month;
        });
    }
};
