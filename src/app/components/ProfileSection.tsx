'use client'

import React from 'react';

interface ProfileStats {
    number: string;
    label: string;
}

const stats: ProfileStats[] = [
    { number: '1.2K', label: 'Subscribers' },
    { number: '247', label: 'Posts' },
    { number: '15.3K', label: 'Purrs' },
    { number: '89%', label: 'Cuteness' },
];

export default function ProfileSection() {
    const handleSubscribe = () => {
        alert(`Welcome to Hank's exclusive content! 🐱

You now have access to:
• Daily cat photos & videos
• Live streaming nap sessions
• Personal messages from Hank
• Behind-the-scenes content
• Premium toe bean gallery

Thank you for supporting quality cat content! 💖`);
    };

    return (
        <section className="profile-section">
            <div className="profile-pic">🐈</div>
            <div className="profile-info">
                <h1 className="profile-name">Hank the Cat</h1>
                <div className="profile-stats">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
                <div className="bio">
                    <h3>About Hank</h3>
                    <p>
                        Professional napper, treat connoisseur, and part-time zoomies athlete.
                        I specialize in knocking things off tables, demanding belly rubs, and
                        looking absolutely adorable while doing it. Subscribe for exclusive content
                        of my daily adventures, naptime positions, and premium toe bean reveals! 🐾
                    </p>
                </div>
                <button className="subscribe-btn" onClick={handleSubscribe}>
                    Subscribe for $9.99/month 💖
                </button>
            </div>
        </section>
    );
}