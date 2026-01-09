import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Placeholder images - replace with actual gallery images
const galleryImages = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        title: "Main Stage",
        category: "Concerts"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800",
        title: "Crowd Energy",
        category: "Concerts"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        title: "Night Vibes",
        category: "Concerts"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        title: "DJ Night",
        category: "Concerts"
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800",
        title: "Dance Performance",
        category: "Dance"
    },
    {
        id: 6,
        src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
        title: "Classical Dance",
        category: "Dance"
    },
    {
        id: 7,
        src: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800",
        title: "Street Dance",
        category: "Dance"
    },
    {
        id: 8,
        src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
        title: "Stage Drama",
        category: "Drama"
    },
    {
        id: 9,
        src: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
        title: "Theatre Night",
        category: "Drama"
    },
    {
        id: 10,
        src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
        title: "Art Exhibition",
        category: "Art"
    },
    {
        id: 11,
        src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
        title: "Painting Display",
        category: "Art"
    },
    {
        id: 12,
        src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
        title: "Creative Corner",
        category: "Art"
    }
];

const categories = ["All", "Concerts", "Dance", "Drama", "Art"];

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImage, setSelectedImage] = useState(null);

    const filteredImages = activeCategory === "All"
        ? galleryImages
        : galleryImages.filter(img => img.category === activeCategory);

    return (
        <div className="gallery-page">
            <div className="gallery-container">
                <motion.div
                    className="gallery-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="gallery-back-btn">← Back</Link>
                    <h1 className="gallery-title">Gallery</h1>
                    <p className="gallery-subtitle">Relive the memories of Spring Fest</p>
                </motion.div>

                <div className="gallery-categories">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`gallery-category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <motion.div
                    className="gallery-grid"
                    layout
                >
                    <AnimatePresence>
                        {filteredImages.map((image, idx) => (
                            <motion.div
                                key={image.id}
                                className="gallery-item"
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img src={image.src} alt={image.title} loading="lazy" />
                                <div className="gallery-item-overlay">
                                    <span className="gallery-item-title">{image.title}</span>
                                    <span className="gallery-item-category">{image.category}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className="gallery-lightbox"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                        >
                            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
                            <motion.img
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            />
                            <div className="lightbox-info">
                                <h3>{selectedImage.title}</h3>
                                <p>{selectedImage.category}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
        .gallery-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%);
          padding: 2rem;
        }

        .gallery-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .gallery-back-btn {
          position: absolute;
          left: 0;
          top: 0;
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background: rgba(39, 39, 42, 0.6);
          border: 1px solid rgba(161, 161, 170, 0.2);
          transition: all 0.2s;
        }

        .gallery-back-btn:hover {
          color: #fafafa;
          border-color: rgba(161, 161, 170, 0.4);
        }

        .gallery-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
        }

        .gallery-subtitle {
          color: #a1a1aa;
          font-size: 1.1rem;
          margin: 0;
        }

        .gallery-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .gallery-category-btn {
          padding: 0.6rem 1.25rem;
          border-radius: 20px;
          border: 1px solid rgba(161, 161, 170, 0.2);
          background: rgba(39, 39, 42, 0.4);
          color: #a1a1aa;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .gallery-category-btn:hover {
          border-color: rgba(16, 185, 129, 0.4);
          color: #fafafa;
        }

        .gallery-category-btn.active {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: transparent;
          color: #fff;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: rgba(39, 39, 42, 0.6);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.1);
        }

        .gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.25rem;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .gallery-item:hover .gallery-item-overlay {
          opacity: 1;
        }

        .gallery-item-title {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .gallery-item-category {
          color: #10b981;
          font-size: 0.85rem;
        }

        .gallery-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .gallery-lightbox img {
          max-width: 90%;
          max-height: 75vh;
          border-radius: 12px;
          object-fit: contain;
        }

        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          background: none;
          border: none;
          color: #fff;
          font-size: 2.5rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .lightbox-close:hover {
          transform: scale(1.2);
        }

        .lightbox-info {
          text-align: center;
          margin-top: 1rem;
        }

        .lightbox-info h3 {
          color: #fff;
          font-size: 1.25rem;
          margin: 0 0 0.25rem 0;
        }

        .lightbox-info p {
          color: #10b981;
          margin: 0;
        }

        @media (max-width: 640px) {
          .gallery-page {
            padding: 1rem;
          }

          .gallery-title {
            font-size: 1.75rem;
            margin-top: 2.5rem;
          }

          .gallery-back-btn {
            position: static;
            display: inline-block;
            margin-bottom: 1rem;
          }

          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 1rem;
          }

          .gallery-item {
            aspect-ratio: 1;
          }
        }
      `}</style>
        </div>
    );
}
