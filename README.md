# Godson Travels Website

A complete travel agency website built with HTML, CSS, and JavaScript. Features package management, booking system, and admin panel.

## Features

- **Package Management**: View and manage travel packages for Kodaikanal, Munnar, and Ooty
- **Package Types**: Couples, Honeymoon, College IV, and more
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for packages
- **Booking System**: Track monthly bookings with status management
- **Contact Integration**: Direct phone (9751764713) and email (godsontravels@outlook.com) links
- **Image Gallery**: Beautiful image galleries for each package
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
GODSON/
├── index.html              # Home page with package listings
├── package-detail.html     # Individual package detail page
├── admin.html              # Admin panel for CRUD operations
├── bookings.html           # Monthly booked details view
├── css/
│   ├── style.css          # Main stylesheet
│   ├── admin.css          # Admin panel styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── storage.js         # LocalStorage utilities
│   ├── app.js             # Main application logic
│   ├── admin.js           # Admin CRUD operations
│   ├── bookings.js        # Booking management
│   └── init-data.js       # Sample data initialization
└── images/
    ├── kodaikanal/        # Kodaikanal destination images
    ├── munnar/            # Munnar destination images
    └── ooty/              # Ooty destination images
```

## Getting Started

1. **Open the website**: Simply open `index.html` in your web browser
2. **Initial Data**: The website will automatically load sample packages on first visit
3. **Admin Access**: Click on "Admin" in the navigation menu
   - Default password: `admin123` or `admin`

## Adding Images

1. Place your images in the appropriate destination folder:
   - `images/kodaikanal/` for Kodaikanal packages
   - `images/munnar/` for Munnar packages
   - `images/ooty/` for Ooty packages

2. When creating or editing a package in the Admin panel, enter image paths in the "Image Paths" field:
   - One path per line
   - Relative to the website root
   - Example: `images/kodaikanal/lake.jpg`

3. Add a default image at `images/default.jpg` (800x600px recommended) to show when images fail to load

## Admin Panel Features

- **Add Packages**: Create new travel packages with all details
- **Edit Packages**: Update existing package information
- **Delete Packages**: Remove packages with confirmation
- **Export Data**: Download all packages and bookings as JSON
- **Import Data**: Restore data from previously exported JSON file

## Booking System

- Bookings are created when users click "Book Now" on package details
- Booking information is sent via email using mailto: links
- View all bookings on the Bookings page
- Filter bookings by month
- Update booking status (Pending, Confirmed, Cancelled)
- Export bookings as CSV

## Contact Information

- **Phone**: 9751764713 (click-to-call)
- **Email**: godsontravels@outlook.com

## Data Storage

All data is stored in the browser's LocalStorage:
- Packages are stored under the `packages` key
- Bookings are stored under the `bookings` key
- Data persists across browser sessions on the same device

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- This is a client-side only application (no backend server required)
- Data is stored locally in your browser
- To clear all data, use browser's developer tools to clear LocalStorage
- Images should be optimized for web (JPG or PNG format)

## Future Enhancements

- User authentication system
- Backend API integration
- Payment gateway integration
- Email notifications via backend service
- SMS notifications via API
