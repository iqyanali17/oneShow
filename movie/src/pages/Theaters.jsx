import React from "react";

const Theaters = () => {
  const theaters = [
    {
      id: 1,
      name: "One Show Cinema - Downtown",
      address: "123 Main Street, Downtown",
      phone: "(555) 123-4567",
      image: "https://picsum.photos/seed/downtown-theater/400/300.jpg",
      features: ["IMAX", "Dolby Atmos", "Luxury Seating"],
      screens: 12
    },
    {
      id: 2,
      name: "One Show Cinema - Mall",
      address: "456 Shopping Avenue, City Mall",
      phone: "(555) 234-5678",
      image: "https://picsum.photos/seed/mall-theater/400/300.jpg",
      features: ["3D", "Reserved Seating", "Concession Stand"],
      screens: 8
    },
    {
      id: 3,
      name: "One Show Cinema - Plaza",
      address: "789 Plaza Road, Central District",
      phone: "(555) 345-6789",
      image: "https://picsum.photos/seed/plaza-theater/400/300.jpg",
      features: ["4DX", "Premium Plus", "Restaurant"],
      screens: 16
    },
    {
      id: 4,
      name: "One Show Cinema - Riverside",
      address: "321 River Walk, Waterfront",
      phone: "(555) 456-7890",
      image: "https://picsum.photos/seed/riverside-theater/400/300.jpg",
      features: ["VIP", "Bar & Lounge", "Parking"],
      screens: 10
    },
    {
      id: 5,
      name: "One Show Cinema - Airport",
      address: "656 Terminal Road, Airport Complex",
      phone: "(555) 567-8901",
      image: "https://picsum.photos/seed/airport-theater/400/300.jpg",
      features: ["Express Check-in", "Family Friendly", "Food Court"],
      screens: 6
    },
    {
      id: 6,
      name: "One Show Cinema - University",
      address: "987 Campus Drive, University District",
      phone: "(555) 678-9012",
      image: "https://picsum.photos/seed/university-theater/400/300.jpg",
      features: ["Student Discounts", "Art House Films", "Cafe"],
      screens: 4
    }
  ];

  return (
    <div className="px-6 md:px-16 xl:px-44 py-20">
      <h1 className="text-4xl font-bold text-white mb-8">Our Theaters</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters.map((theater) => (
          <div 
            key={theater.id}
            className="bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={theater.image} 
                alt={theater.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${theater.name}/400/300.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">{theater.screens} Screens</p>
                  <p className="text-gray-300 text-xs">Premium Experience</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{theater.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{theater.address}</p>
              <p className="text-gray-500 text-sm mb-3">{theater.phone}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {theater.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-xs">{theater.screens} Screens</p>
                <button className="px-3 py-1 bg-primary hover:bg-primary-dull transition text-white text-sm rounded-full">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theaters;
