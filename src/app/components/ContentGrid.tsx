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
        // setModalLoading(false);
        setModalOpen(false);
        setSelectedFolder(null);
        setFolderFiles([]);
    };

    if (loading) {
        return (
            <main className="content-grid">
                <div className="loading-state">
                    <div className="animate-spin text-3xl mb-4">🐾</div>
                    <p>Loading {contentType}...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="content-grid">
                <div className="error-state">
                    <div className="text-4xl mb-4">😿</div>
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
                    <div className="text-4xl mb-4">📁</div>
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
                                <span className="flex items-center gap-1">❤️ {item.purrs} purrs</span>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* Modal Dialog */}
            <Dialog.Root open={modalOpen} onOpenChange={handleModalClose}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/75 animate-in fade-in duration-150" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none overflow-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
                            <Dialog.Title className="text-xl font-semibold text-gray-900 m-0">
                                {selectedFolder && (
                                    <>
                                        {getContentEmoji(selectedFolder.name, contentType)} {selectedFolder.name}
                                    </>
                                )}
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button className="bg-none border-none cursor-pointer p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Close">
                                    ✕
                                </button>
                            </Dialog.Close>
                        </div>

                        {selectedFolder?.description && (
                            <Dialog.Description className="px-6 my-4 text-gray-500 leading-relaxed flex-shrink-0">
                                {selectedFolder.description}
                            </Dialog.Description>
                        )}

                        <div className="flex-1 px-6 overflow-y-auto min-h-0">
                            {modalLoading ? (
                                <div className="flex flex-col items-center justify-center p-10 text-center h-full">
                                    <div className="text-4xl animate-spin mb-4">🐾</div>
                                    <p>Loading content...</p>
                                </div>
                            ) : folderFiles.length > 0 ? (
                                <div className="py-4 files-list">
                                    <div className="flex flex-wrap items-start gap-2">
                                        {folderFiles.map((file) => (
                                            <div key={file.id} className="flex flex-col items-center">
                                                {file.mimeType.startsWith('image/') ? (
                                                    <div className="relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                        {file.thumbnailLink ? (
                                                            <Image
                                                                src={file.thumbnailLink}
                                                                alt={file.name}
                                                                className="rounded-lg object-cover h-[200px]"
                                                                loading="lazy"
                                                                width={200}
                                                                height={200}
                                                            />
                                                        ) : (
                                                            <div className="w-[200px] h-[200px] flex items-center justify-center text-5xl text-gray-400 rounded-lg bg-gray-100">
                                                                📷
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : file.mimeType.startsWith('video/') ? (
                                                    <div className="w-[200px] h-[200px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                        <div className="text-5xl text-gray-400">
                                                            🎥
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-[200px] h-[200px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                        <div className="text-5xl text-gray-400">
                                                            📄
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="mt-2 text-xs text-gray-700 break-words leading-tight max-w-[200px] text-center">{file.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-10 text-center text-gray-500 h-full">
                                    <div className="text-5xl mb-4">📁</div>
                                    <p>This folder is empty</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex-shrink-0">
                            <div className="flex justify-between items-center text-gray-500 text-sm">
                                {selectedFolder && (
                                    <>
                                        <span>{getTimeAgo(selectedFolder.createdTime)}</span>
                                        <span className="flex items-center gap-1">❤️ {selectedFolder.purrs} purrs</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
