import React, { useEffect, useState } from 'react';
import MemeItem from './MemeItems';
import axios from 'axios';
import './meme.css';
import useEmblaCarousel from 'embla-carousel-react';
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures';

const MemeList = () => {
    const [memes, setMemes] = useState([]);

    // Embla carousel setup with WheelGesturesPlugin
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { axis: 'y' },
        [WheelGesturesPlugin()] // Use plugin here
    );

    useEffect(() => {
        const fetchMemes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/meme');
                setMemes(response.data);
            } catch (error) {
                console.error('Failed to fetch memes:', error);
            }
        };

        fetchMemes();
    }, []);

    return (
        <div className='meme-main-container'>
            <div className='meme-container'>
            <div className="emblameme">
                <div className="emblaviewport" ref={emblaRef}>
                    <div className="emblacontainer">
                        {memes.map((meme) => (
                            <div
                                key={meme._id}
                                className="emblaslide"
                                data-id={meme._id}
                                style={{ marginBottom: '20px' }}
                            >
                                <MemeItem meme={meme} className="emblaslidenumber" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
};

export default MemeList;
