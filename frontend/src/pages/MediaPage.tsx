import React, { useState } from 'react';
import { MediaUpload } from '../components/MediaUpload';
import { MediaList } from '../components/MediaList';

export const MediaPage: React.FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="media-page">
            <h1>Gestionnaire de médias</h1>
            <MediaUpload onUploadSuccess={handleUploadSuccess} />
            <MediaList refreshTrigger={refreshTrigger} />

            <style jsx>{`
                .media-page {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                h1 {
                    color: #14171a;
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                }
            `}</style>
        </div>
    );
}; 