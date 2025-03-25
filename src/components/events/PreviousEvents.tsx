"use client";

import { motion } from "framer-motion";

export default function PreviousEvents() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-24"
    >
      <h2 className="text-4xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-8">
        Previous Events
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            title: "Quantum Computing Summit",
            description: "Exploring the future of quantum computing and its applications.",
            date: "March 15, 2024",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
          },
          {
            title: "Cybersecurity Conference",
            description: "Advanced security protocols and threat prevention strategies.",
            date: "February 20, 2024",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
          },
          {
            title: "AI & Ethics Symposium",
            description: "Discussing the ethical implications of artificial intelligence.",
            date: "January 25, 2024",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
          },
          {
            title: "Web3 Development Workshop",
            description: "Hands-on experience with blockchain and decentralized apps.",
            date: "January 10, 2024",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0"
          },
          {
            title: "Tech Startup Showcase",
            description: "Innovative startups presenting their groundbreaking solutions.",
            date: "December 15, 2023",
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd"
          },
          {
            title: "Data Science Conference",
            description: "Latest trends in big data analytics and machine learning.",
            date: "December 1, 2023",
            image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0"
          }
        ].map((event, index) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#8B30FF]/20 to-[#C661E3]/20 p-6 backdrop-blur-md border border-[#CFFB2D]/20"
          >
            <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <h3 className="text-xl font-bold text-[#CFFB2D] font-['Orbitron'] mb-4">
              {event.title}
            </h3>
            <p className="text-gray-300 font-['Share_Tech_Mono'] mb-2">
              {event.description}
            </p>
            <p className="text-[#C661E3] font-['Share_Tech_Mono']">
              {event.date}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
