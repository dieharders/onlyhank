'use client';

import React from 'react';
import type { ContentType } from '../page';

interface NavigationProps {
    activeContent: ContentType;
    onContentChange: (content: ContentType) => void;
}

const navItems = [
    { key: 'home', label: 'Home', isContent: false },
    { key: 'photos', label: 'Photos', isContent: true },
    { key: 'videos', label: 'Videos', isContent: true },
    { key: 'live', label: 'Live Streams', isContent: false },
    { key: 'messages', label: 'Messages', isContent: false },
];

export default function Navigation({ activeContent, onContentChange }: NavigationProps) {
    const handleNavClick = (item: typeof navItems[0]) => {
        if (item.isContent) {
            onContentChange(item.key as ContentType);
        }
    };

    return (
        <nav className="navigation">
            {navItems.map((item) => (
                <a
                    key={item.key}
                    href="#"
                    className={`nav-item ${(item.isContent && activeContent === item.key) ||
                            (!item.isContent && item.key === 'home' && !['photos', 'videos'].includes(activeContent))
                            ? 'active'
                            : ''
                        }`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item);
                    }}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
}
