'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { getContentByType, getFolderFiles } from '../../lib/actions';
import { getTimeAgo } from '../../lib/utils';
import type { DriveFolder } from '../../lib/google-drive';
import type { ContentType } from '../page';

interface ContentGridProps {
    contentType: ContentType;
}

interface ContentItem extends DriveFolder {
    emoji?: string;
    purrs: number;
}

interface DriveFile {
    id: string;
    name: string;
    thumbnailLink?: string;
    webViewLink?: string;
    mimeType: string;
}

const placeholderData: ContentItem[] = [
    {
        id: '1',
        emoji: '😸',
        name: 'Morning Stretch Session',
        description: 'Starting the day right with some premium stretching content. Watch me demonstrate the perfect cat yoga pose!',
        createdTime: '2 hours ago',
        purrs: 156,
    },
    {
        id: '2',
        emoji: '😺',
        name: 'Sunbeam Nap Chronicles',
        description: 'Exclusive footage of my afternoon sunbeam nap. This premium content shows my best sleeping positions and dream twitches!',
        createdTime: '5 hours ago',
        purrs: 289,
    },
    {
        id: '3',
        emoji: '😽',
        name: 'Treat Time Reactions',
        description: 'Behind-the-scenes content of my genuine reactions to different treats. Spoiler: I love them all, but some get extra purrs!',
        createdTime: '1 day ago',
        purrs: 342,
    },
    {
        id: '4',
        emoji: '😻',
        name: 'Box Fort Adventures',
        description: 'Premium content featuring my custom cardboard castle. Watch as I claim my territory and defend it from invisible enemies!',
        createdTime: '2 days ago',
        purrs: 198,
    },
    {
        id: '5',
        emoji: '🙀',
        name: 'Midnight Zoomies',
        description: 'Exclusive late-night content! Experience my 3 AM energy bursts and witness the legendary couch-to-cat-tree parkour routine.',
        createdTime: '3 days ago',
        purrs: 445,
    },
    {
        id: '6',
        emoji: '😹',
        name: 'Toe Bean Close-ups',
        description: 'The content you\'ve all been waiting for! High-definition, artistic shots of my premium toe beans in various lighting conditions.',
        createdTime: '1 week ago',
        purrs: 567,
    },
];

// Default emoji mapping for different content types
const getContentEmoji = (folderName: string, contentType: ContentType): string => {
    const photoEmojis = ['😸', '😺', '😽', '😻', '🙀', '😹', '😼', '🐱', '🐈', '🐱‍👤'];
    const videoEmojis = ['🎬', '🎥', '📹', '🎞️', '🎪', '🎭', '🎨', '🎯', '⭐', '🌟'];

    const emojis = contentType === 'photos' ? photoEmojis : videoEmojis;
    // Use folder name to consistently pick an emoji
    const index = folderName.length % emojis.length;
    return emojis[index];
};

export default function ContentGrid({ contentType }: ContentGridProps) {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<ContentItem | null>(null);
    const [folderFiles, setFolderFiles] = useState<DriveFile[]>([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const renderPlaceHolderData = useCallback(() => {
        return placeholderData.map((item) => (
            <div
                key={item.id}
                className="content-card"
                onClick={() => handlePlaceholderClick(item)}
            >
                <div className="content-image">
                    {getContentEmoji(item.name, contentType)}
                </div>
                <div className="content-info">
                    <h3 className="content-title">{item.name}</h3>
                    <p className="content-description">
                        {item.description || `Exclusive ${contentType.slice(0, -1)} content featuring Hank!`}
                    </p>
                    <div className="content-meta">
                        <span>{getTimeAgo(item.createdTime)}</span>
                        <span className="likes">❤️ {item.purrs} purrs</span>
                    </div>
                </div>
            </div>
        ))
    }, [contentType]);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);

            try {
                const folders = await getContentByType(contentType);
                const contentItems: ContentItem[] = folders.map(folder => ({
                    ...folder,
                    purrs: Math.floor(Math.random() * 500) + 50, // Random initial purrs
                }));

                setContent(contentItems);
            } catch (err) {
                console.error('Error loading content:', err);
                setError('Failed to load content. Please check your Google Drive configuration.');
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [contentType]);

    // Update purrs periodically
    useEffect(() => {
        if (content.length === 0) return;

        const interval = setInterval(() => {
            setContent(prevContent =>
                prevContent.map(item => ({
                    ...item,
                    purrs: item.purrs + Math.floor(Math.random() * 3),
                }))
            );
        }, 10000);

        return () => clearInterval(interval);
    }, [content.length]);

    const handleContentClick = async (item: ContentItem) => {
        console.log('Clicked folder:', item);
        setSelectedFolder(item);
        setModalOpen(true);
        setModalLoading(true);

        try {
            console.log('Fetching files for folder ID:', item.id);
            const files = await getFolderFiles(item.id);
            console.log('Retrieved files:', files);
            setFolderFiles(files);
        } catch (err) {
            console.error('Error loading folder files:', err);
            setError(`Failed to load folder contents: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setFolderFiles([]);
        } finally {
            setModalLoading(false);
        }
    };

    const handlePlaceholderClick = (item: ContentItem) => {
        alert(`🔒 Premium Content: ${item.name}

Subscribe to unlock this exclusive content from Hank!`);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedFolder(null);
        setFolderFiles([]);
    };

    if (loading) {
        return (
            <main className="content-grid">
                <div className="loading-state">
                    <div className="loading-spinner">🐾</div>
                    <p>Loading {contentType}...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="content-grid">
                <div className="error-state">
                    <div className="error-icon">😿</div>
                    <p>{error}</p>
                    <p className="error-help">
                        Make sure your Google Drive credentials are configured in .env.local
                    </p>
                </div>
            </main>
        );
    }

    if (content.length === 0) {
        return (
            <main className="content-grid">
                <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <p>No {contentType} found</p>
                    <p className="empty-help">
                        Create folders in your Google Drive under onlyhank/{contentType}
                    </p>
                </div>
                {renderPlaceHolderData()}
            </main>
        );
    }

    return (
        <>
            <main className="content-grid">
                {content.map((item) => (
                    <div
                        key={item.id}
                        className="content-card"
                        onClick={() => handleContentClick(item)}
                    >
                        <div className="content-image">
                            {getContentEmoji(item.name, contentType)}
                        </div>
                        <div className="content-info">
                            <h3 className="content-title">{item.name}</h3>
                            <p className="content-description">
                                {item.description || `Exclusive ${contentType.slice(0, -1)} content featuring Hank!`}
                            </p>
                            <div className="content-meta">
                                <span>{getTimeAgo(item.createdTime)}</span>
                                <span className="likes">❤️ {item.purrs} purrs</span>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* Modal Dialog */}
            <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="modal-overlay" />
                    <Dialog.Content className="modal-content">
                        <div className="modal-header">
                            <Dialog.Title className="modal-title">
                                {selectedFolder && (
                                    <>
                                        {getContentEmoji(selectedFolder.name, contentType)} {selectedFolder.name}
                                    </>
                                )}
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button className="modal-close-button" aria-label="Close">
                                    ✕
                                </button>
                            </Dialog.Close>
                        </div>

                        {selectedFolder?.description && (
                            <Dialog.Description className="modal-description">
                                {selectedFolder.description}
                            </Dialog.Description>
                        )}

                        <div className="modal-body">
                            {modalLoading ? (
                                <div className="modal-loading">
                                    <div className="loading-spinner">🐾</div>
                                    <p>Loading content...</p>
                                </div>
                            ) : folderFiles.length > 0 ? (
                                <div className="files-grid">
                                    {folderFiles.map((file) => (
                                        <div key={file.id} className="file-item">
                                            {file.mimeType.startsWith('image/') ? (
                                                <div className="image-container">
                                                    {file.thumbnailLink ? (
                                                        <Image
                                                            src={file.thumbnailLink}
                                                            alt={file.name}
                                                            className="file-image"
                                                            loading="lazy"
                                                            height={200}
                                                            width={200}
                                                        />
                                                    ) : (
                                                        <div className="file-placeholder">
                                                            📷
                                                        </div>
                                                    )}
                                                </div>
                                            ) : file.mimeType.startsWith('video/') ? (
                                                <div className="video-container">
                                                    <div className="video-placeholder">
                                                        🎥
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="file-placeholder">
                                                    📄
                                                </div>
                                            )}
                                            <p className="file-name">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-folder">
                                    <div className="empty-icon">📁</div>
                                    <p>This folder is empty</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <div className="modal-meta">
                                {selectedFolder && (
                                    <>
                                        <span>{getTimeAgo(selectedFolder.createdTime)}</span>
                                        <span className="likes">❤️ {selectedFolder.purrs} purrs</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <style jsx>{`
                .modal-overlay {
                    background-color: rgba(0, 0, 0, 0.5);
                    position: fixed;
                    inset: 0;
                    animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
                                hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90vw;
                    max-width: 800px;
                    max-height: 90vh;
                    padding: 0;
                    animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .modal-title {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: #111827;
                }

                .modal-close-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 16px;
                    color: #6b7280;
                    transition: background-color 0.2s;
                }

                .modal-close-button:hover {
                    background-color: #f3f4f6;
                }

                .modal-description {
                    padding: 0 24px;
                    margin: 16px 0;
                    color: #6b7280;
                    line-height: 1.5;
                }

                .modal-body {
                    flex: 1;
                    padding: 0 24px;
                    overflow-y: auto;
                }

                .modal-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    text-align: center;
                }

                .files-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                    padding: 16px 0;
                }

                .file-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .image-container,
                .video-container {
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    background-color: #f3f4f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .file-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .file-placeholder,
                .video-placeholder {
                    font-size: 48px;
                    color: #9ca3af;
                }

                .file-name {
                    margin-top: 8px;
                    font-size: 14px;
                    color: #374151;
                    word-break: break-word;
                }

                .empty-folder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    text-align: center;
                    color: #6b7280;
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .modal-footer {
                    padding: 24px;
                    border-top: 1px solid #e5e7eb;
                }

                .modal-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #6b7280;
                    font-size: 14px;
                }

                .likes {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                @keyframes overlayShow {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes contentShow {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -48%) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                @media (max-width: 640px) {
                    .modal-content {
                        width: 95vw;
                        max-height: 95vh;
                    }

                    .files-grid {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 12px;
                    }

                    .modal-header,
                    .modal-body,
                    .modal-footer {
                        padding: 16px;
                    }
                }
            `}</style>
        </>
    );
}
