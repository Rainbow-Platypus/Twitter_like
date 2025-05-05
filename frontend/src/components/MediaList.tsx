import React, { useEffect, useState } from 'react';
import { Media, mediaService } from '../services/mediaService';

interface MediaListProps {
    refreshTrigger?: number;
}

export const MediaList: React.FC<MediaListProps> = ({ refreshTrigger = 0 }) => {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const mediaList = await mediaService.getAllMedia();
            setMedia(mediaList);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des médias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedia();
    }, [refreshTrigger]);

    const handleDelete = async (id: number) => {
        try {
            await mediaService.deleteMedia(id);
            setMedia(media.filter(m => m.id !== id));
        } catch (err) {
            setError('Erreur lors de la suppression du média');
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="media-list">
            {media.length === 0 ? (
                <div className="no-media">Aucun média disponible</div>
            ) : (
                <div className="grid">
                    {media.map((item) => (
                        <div key={item.id} className="media-item">
                            {item.mimeType.startsWith('image/') ? (
                                <img
                                    src={mediaService.getMediaUrl(item.filename)}
                                    alt={item.originalName}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="file-icon">
                                    <span>{item.mimeType}</span>
                                </div>
                            )}
                            <div className="media-info">
                                <span className="filename">{item.originalName}</span>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="delete-btn"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .media-list {
                    margin: 1rem 0;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .media-item {
                    border: 1px solid #e1e8ed;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .media-item img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }
                .file-icon {
                    height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f5f8fa;
                    color: #657786;
                }
                .media-info {
                    padding: 0.5rem;
                }
                .filename {
                    display: block;
                    font-size: 0.875rem;
                    margin-bottom: 0.5rem;
                    word-break: break-all;
                }
                .delete-btn {
                    background-color: #e0245e;
                    color: white;
                    border: none;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    cursor: pointer;
                }
                .delete-btn:hover {
                    background-color: #c01e4e;
                }
                .loading, .error, .no-media {
                    text-align: center;
                    padding: 2rem;
                    color: #657786;
                }
                .error {
                    color: #e0245e;
                }
            `}</style>
        </div>
    );
}; 