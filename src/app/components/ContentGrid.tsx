'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getContentByType } from '../../lib/actions';
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

    const renderPlaceHolderData = useCallback(() => {
        return placeholderData.map((item) => (
            <div
                key={item.id}
                className="content-card"
                onClick={() => handleContentClick(item.name)}
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

    const handleContentClick = (title: string) => {
        alert(`🔒 Premium Content: ${title}

Subscribe to unlock this exclusive content from Hank!`);
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
        <main className="content-grid">
            {content.map((item) => (
                <div
                    key={item.id}
                    className="content-card"
                    onClick={() => handleContentClick(item.name)}
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
    );
}