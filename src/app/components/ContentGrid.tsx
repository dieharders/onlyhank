'use client';

import React, { useState, useEffect } from 'react';

interface ContentItem {
    id: number;
    emoji: string;
    title: string;
    description: string;
    timeAgo: string;
    purrs: number;
}

const contentData: ContentItem[] = [
    {
        id: 1,
        emoji: '😸',
        title: 'Morning Stretch Session',
        description: 'Starting the day right with some premium stretching content. Watch me demonstrate the perfect cat yoga pose!',
        timeAgo: '2 hours ago',
        purrs: 156,
    },
    {
        id: 2,
        emoji: '😺',
        title: 'Sunbeam Nap Chronicles',
        description: 'Exclusive footage of my afternoon sunbeam nap. This premium content shows my best sleeping positions and dream twitches!',
        timeAgo: '5 hours ago',
        purrs: 289,
    },
    {
        id: 3,
        emoji: '😽',
        title: 'Treat Time Reactions',
        description: 'Behind-the-scenes content of my genuine reactions to different treats. Spoiler: I love them all, but some get extra purrs!',
        timeAgo: '1 day ago',
        purrs: 342,
    },
    {
        id: 4,
        emoji: '😻',
        title: 'Box Fort Adventures',
        description: 'Premium content featuring my custom cardboard castle. Watch as I claim my territory and defend it from invisible enemies!',
        timeAgo: '2 days ago',
        purrs: 198,
    },
    {
        id: 5,
        emoji: '🙀',
        title: 'Midnight Zoomies',
        description: 'Exclusive late-night content! Experience my 3 AM energy bursts and witness the legendary couch-to-cat-tree parkour routine.',
        timeAgo: '3 days ago',
        purrs: 445,
    },
    {
        id: 6,
        emoji: '😹',
        title: 'Toe Bean Close-ups',
        description: 'The content you\'ve all been waiting for! High-definition, artistic shots of my premium toe beans in various lighting conditions.',
        timeAgo: '1 week ago',
        purrs: 567,
    },
];

export default function ContentGrid() {
    const [content, setContent] = useState<ContentItem[]>(contentData);

    useEffect(() => {
        const interval = setInterval(() => {
            setContent(prevContent =>
                prevContent.map(item => ({
                    ...item,
                    purrs: item.purrs + Math.floor(Math.random() * 3),
                }))
            );
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleContentClick = (title: string) => {
        alert(`🔒 Premium Content: ${title}

Subscribe to unlock this exclusive content from Hank!`);
    };

    return (
        <main className="content-grid">
            {content.map((item) => (
                <div
                    key={item.id}
                    className="content-card"
                    onClick={() => handleContentClick(item.title)}
                >
                    <div className="content-image">{item.emoji}</div>
                    <div className="content-info">
                        <h3 className="content-title">{item.title}</h3>
                        <p className="content-description">{item.description}</p>
                        <div className="content-meta">
                            <span>{item.timeAgo}</span>
                            <span className="likes">❤️ {item.purrs} purrs</span>
                        </div>
                    </div>
                </div>
            ))}
        </main>
    );
}