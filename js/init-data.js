// Initialize sample data if LocalStorage is empty

document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
});

function initializeSampleData() {
    const packages = Storage.getPackages();
    
    // Only initialize if no packages exist
    if (packages.length > 0) {
        return;
    }

    const samplePackages = [
        {
            name: "Romantic Kodaikanal Escape",
            type: "Couples",
            destination: "Kodaikanal",
            price: 25000,
            duration: "3D/2N",
            description: "Experience the perfect romantic getaway in the Princess of Hill Stations. Enjoy scenic boat rides on Kodaikanal Lake, breathtaking views from Coaker's Walk, and intimate candlelight dinners. This package includes luxury accommodation, breakfast, and guided sightseeing.",
            itinerary: [
                "Day 1: Arrival in Kodaikanal, Check-in, Visit Kodaikanal Lake",
                "Day 2: Coaker's Walk, Pillar Rocks, Green Valley View, Pine Forest",
                "Day 3: Silver Cascade Falls, Departure"
            ],
            images: [
                "images/kodaikanal/kodaikanal1.jpg",
                "images/kodaikanal/kodaikanal2.jpg",
                "images/kodaikanal/kodaikanal3.jpg"
            ]
        },
        {
            name: "Honeymoon Bliss in Munnar",
            type: "Honeymoon",
            destination: "Munnar",
            price: 35000,
            duration: "4D/3N",
            description: "Begin your journey of togetherness amidst the tea gardens and misty hills of Munnar. This exclusive honeymoon package offers private villa accommodation, romantic sunrise experiences, spa treatments for couples, and memorable moments in nature's lap.",
            itinerary: [
                "Day 1: Arrival, Check-in to luxury resort, Tea plantation tour",
                "Day 2: Eravikulam National Park, Mattupetty Dam, Kundala Lake",
                "Day 3: Top Station visit, Spice plantation, Romantic dinner",
                "Day 4: Morning spa session, Departure"
            ],
            images: [
                "images/munnar/munnar1.jpg",
                "images/munnar/munnar2.jpg",
                "images/munnar/munnar3.jpg"
            ]
        },
        {
            name: "Ooty Hill Station Adventure",
            type: "College IV",
            destination: "Ooty",
            price: 12000,
            duration: "3D/2N",
            description: "Perfect for college groups! Explore the Queen of Hill Stations with your friends. Affordable accommodation, group activities, adventure sports, and memorable group experiences. Includes train rides, trekking, and bonfire nights.",
            itinerary: [
                "Day 1: Arrival, Check-in, Ooty Lake boating, Botanical Gardens",
                "Day 2: Dodabetta Peak, Tea Museum, Rose Garden, Group games",
                "Day 3: Pykara Falls, Nilgiri Mountain Railway, Departure"
            ],
            images: [
                "images/ooty/ooty1.jpg",
                "images/ooty/ooty2.jpg",
                "images/ooty/ooty3.jpg"
            ]
        },
        {
            name: "Couples Retreat - Munnar",
            type: "Couples",
            destination: "Munnar",
            price: 28000,
            duration: "3D/2N",
            description: "A serene escape for couples seeking peace and tranquility. Enjoy comfortable stays, scenic drives through tea estates, beautiful viewpoints, and quality time together in the cool mountain air.",
            itinerary: [
                "Day 1: Arrival, Check-in, Evening walk at Tea Gardens",
                "Day 2: Eravikulam National Park, Photo Point, Tea Museum",
                "Day 3: Attukal Waterfalls, Departure"
            ],
            images: [
                "images/munnar/munnar4.jpg",
                "images/munnar/munnar5.jpg"
            ]
        },
        {
            name: "Royal Honeymoon - Ooty",
            type: "Honeymoon",
            destination: "Ooty",
            price: 40000,
            duration: "5D/4N",
            description: "The ultimate luxury honeymoon experience in Ooty. Premium resort with private balcony views, couple spa sessions, private dining arrangements, and exclusive sightseeing. Create memories that last a lifetime.",
            itinerary: [
                "Day 1: Arrival, Luxury check-in, Resort facilities",
                "Day 2: Ooty Lake, Botanical Gardens, Private tea tasting",
                "Day 3: Nilgiri Mountain Railway, Doddabetta Peak, Candlelight dinner",
                "Day 4: Pykara Lake, Waterfalls, Couple spa session",
                "Day 5: Rose Garden, Shopping, Departure"
            ],
            images: [
                "images/ooty/ooty4.jpg",
                "images/ooty/ooty5.jpg",
                "images/ooty/ooty6.jpg"
            ]
        },
        {
            name: "College IV - Kodaikanal Fun Package",
            type: "College IV",
            destination: "Kodaikanal",
            price: 10000,
            duration: "2D/1N",
            description: "Budget-friendly package designed for college students. Dormitory-style accommodation, group activities, fun games, and exploration of Kodaikanal's popular spots. Perfect for creating unforgettable college memories!",
            itinerary: [
                "Day 1: Arrival, Check-in, Kodaikanal Lake, Bryant Park",
                "Day 2: Coaker's Walk, Pillar Rocks, Departure"
            ],
            images: [
                "images/kodaikanal/kodaikanal4.jpg",
                "images/kodaikanal/kodaikanal5.jpg"
            ]
        },
        {
            name: "Romantic Ooty Getaway",
            type: "Couples",
            destination: "Ooty",
            price: 22000,
            duration: "3D/2N",
            description: "A delightful couple's package to Ooty with comfortable accommodation, romantic settings, and all major attractions. Perfect balance of relaxation and exploration.",
            itinerary: [
                "Day 1: Arrival, Ooty Lake, Botanical Gardens",
                "Day 2: Doddabetta Peak, Tea Museum, Rose Garden",
                "Day 3: Nilgiri Mountain Railway experience, Departure"
            ],
            images: [
                "images/ooty/ooty7.jpg",
                "images/ooty/ooty8.jpg"
            ]
        },
        {
            name: "Dream Honeymoon - Kodaikanal",
            type: "Honeymoon",
            destination: "Kodaikanal",
            price: 38000,
            duration: "4D/3N",
            description: "An intimate honeymoon package in Kodaikanal with premium accommodation, private tours, romantic dinners, and exclusive experiences. Every moment designed for newlyweds.",
            itinerary: [
                "Day 1: Arrival, Luxury check-in, Sunset at Coaker's Walk",
                "Day 2: Kodaikanal Lake boating, Pillar Rocks, Private candlelight dinner",
                "Day 3: Green Valley View, Pine Forest, Spa session",
                "Day 4: Silver Cascade, Kurinji Andavar Temple, Departure"
            ],
            images: [
                "images/kodaikanal/kodaikanal6.jpg",
                "images/kodaikanal/kodaikanal7.jpg",
                "images/kodaikanal/kodaikanal8.jpg"
            ]
        }
    ];

    // Add all sample packages to storage
    samplePackages.forEach(pkg => {
        Storage.addPackage(pkg);
    });

    console.log('Sample packages initialized!');
}
