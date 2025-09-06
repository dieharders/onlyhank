'use client';

import React, { useState } from 'react';

const navItems = ['Home', 'Photos', 'Videos', 'Live Streams', 'Messages'];

export default function Navigation() {
    const [activeItem, setActiveItem] = useState('Home');

    return (
        <nav className="navigation">
            {navItems.map((item) => (
                <a
                    key={item}
                    href="#"
                    className={`nav-item ${activeItem === item ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveItem(item);
                    }}
                >
                    {item}
                </a>
            ))}
        </nav>
    );
}