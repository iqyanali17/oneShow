import React from "react";

const Releases = () => {
  const releases = [
    {
      id: 1,
      title: "Avatar 3",
      releaseDate: "2025-12-20",
      genre: "Sci-Fi, Adventure",
      poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Lv2TtyPoY6T1NzOJoF.jpg",
      rating: 8.5
    },
    {
      id: 2,
      title: "Captain America: Brave New World",
      releaseDate: "2025-02-14",
      genre: "Action, Superhero",
      poster: "https://image.tmdb.org/t/p/w500/vBEdoVrEz4Plb3nswM6kEHlCRfe.jpg",
      rating: 7.8
    },
    {
      id: 3,
      title: "Thunderbolts",
      releaseDate: "2025-07-25",
      genre: "Action, Superhero",
      poster: "https://image.tmdb.org/t/p/w500/jmlpCyxtp3Wszrfl8Wv6CYcUWHh.jpg",
      rating: 7.2
    },
    {
      id: 4,
      title: "The Batman 2",
      releaseDate: "2025-10-03",
      genre: "Action, Crime",
      poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36zrwoYcn6X06dYcFY.jpg",
      rating: 8.9
    },
    {
      id: 5,
      title: "Mufasa: The Lion King",
      releaseDate: "2024-12-20",
      genre: "Animation, Adventure",
      poster: "https://image.tmdb.org/t/p/w500/4lLodXW6by9jQMOuejgTl8P5NxD.jpg",
      rating: 7.5
    },
    {
      id: 6,
      title: "Snow White",
      releaseDate: "2025-03-21",
      genre: "Fantasy, Musical",
      poster: "https://image.tmdb.org/t/p/w500/h3F4KOWJc2A2f4gk4bAqg1t2Zk6.jpg",
      rating: 6.8
    }
  ];

  return (
    <div className="px-6 md:px-16 xl:px-44 py-20">
      <h1 className="text-4xl font-bold text-white mb-8">Upcoming Releases</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {releases.map((release) => (
          <div 
            key={release.id}
            className="bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={release.poster} 
                alt={release.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${release.title}/300/450.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">Coming Soon</p>
                  <p className="text-gray-300 text-xs">{new Date(release.releaseDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{release.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{release.genre}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-xs">{new Date(release.releaseDate).toLocaleDateString()}</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-white text-sm">{release.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Releases;
