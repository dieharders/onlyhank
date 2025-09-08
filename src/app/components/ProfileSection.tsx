'use client'

import React from 'react';
import Image from 'next/image';
import profilePic from '../../../public/hank-profile.webp'

interface ProfileStats {
    number: string;
    label: string;
}

const stats: ProfileStats[] = [
    { number: '1.2K', label: 'Subscribers' },
    { number: '247', label: 'Posts' },
    { number: '15.3K', label: 'Purrs' },
    { number: '99.9%', label: 'Cuteness' },
    { number: '65%', label: 'Sass' },
    { number: '420', label: 'Comments' },
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
            <div className="flex items-center justify-center rounded bg-transparent">
                <Image src={profilePic} alt="🐈" width={300} height={300} className="object-cover rounded-full border-[5px] border-red-400 shadow-[0_10px_30px_rgba(0,0,0,0.1)]" />
            </div>
            <div className="flex-1">
                <h1 className="profile-name">Hank (Kikiki)</h1>
                <div className="profile-stats">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
                <div className="bio">
                    <h2>About</h2>
                    <p>
                        Professional napper, treat connoisseur, scaredey-cat, and part-time zoomies athlete.
                        I specialize in knocking things off tables, demanding belly rubs, and
                        looking serious about my bizness. Subscribe for exclusive content
                        of my daily adventures, naptime positions, and premium toe bean reveals! 🐾
                    </p>
                    <br></br>
                    <h3>Nicknames:</h3>
                    <p>
                        Hanky, Wawa, Kikiki, Hanky-Panky, Hankster, Hair Pirate Hank, Hankinator, Hank the Tank, Hank Time, Baba, Baba-bababa
                    </p>
                </div>
                <button className="subscribe-btn" onClick={handleSubscribe}>
                    Subscribe for $9.99/month 💖
                </button>
            </div>
        </section>
    );
}