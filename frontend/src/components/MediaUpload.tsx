import React, { useState } from 'react';
import { mediaService } from '../services/mediaService';

interface MediaUploadProps {
    onUploadSuccess?: () => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadSuccess }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            await mediaService.uploadMedia(file);
            if (onUploadSuccess) {
                onUploadSuccess();
            }
            event.target.value = ''; // Reset input
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du téléchargement');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="media-upload">
            <label className="upload-button">
                <input
                    type="file"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
                <span className={`btn ${isUploading ? 'uploading' : ''}`}>
                    {isUploading ? 'Téléchargement...' : 'Télécharger un média'}
                </span>
            </label>
            {error && <div className="error-message">{error}</div>}

            <style jsx>{`
                .media-upload {
                    margin: 1rem 0;
                }
                .upload-button {
                    cursor: pointer;
                }
                .btn {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background-color: #1da1f2;
                    color: white;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                .btn:hover {
                    background-color: #1a91da;
                }
                .btn.uploading {
                    background-color: #9bd1f9;
                    cursor: not-allowed;
                }
                .error-message {
                    color: #e0245e;
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                }
            `}</style>
        </div>
    );
}; 