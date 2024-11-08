import React, { useEffect, useState, useRef } from 'react';
import MemeItem from './MemeItems';
import axios from 'axios';
import './meme.css';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

const MemeList = () => {
    const [memes, setMemes] = useState([]);
    const videoRefs = useRef([]); // Store refs for each video in an array

    // Embla carousel setup with WheelGesturesPlugin
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { axis: 'y', loop: false },
        [WheelGesturesPlugin()] 
    );

    useEffect(() => {
        const fetchMemes = async () => {
            try {
                const response = await axios.get('https://aau-stories-sever.vercel.app/api/users/meme');
                setMemes(response.data);
            } catch (error) {
                console.error('Failed to fetch memes:', error);
            }
        };

        fetchMemes();
    }, []);

    // Control video playback based on active slide
    useEffect(() => {
        if (!emblaApi) return;

        const handleSelect = () => {
            const currentIndex = emblaApi.selectedScrollSnap(); // Get the current slide index
            videoRefs.current.forEach((video, index) => {
                if (video) {
                    if (index === currentIndex) {
                        video.currentTime = 0;
                        video.play();
                    } else {
                        video.pause();
                        video.currentTime = 0;
                    }
                }
            });
        };

        emblaApi.on('select', handleSelect);
        return () => emblaApi.off('select', handleSelect);
    }, [emblaApi]);

    return (
        <div className="meme-main-container">

            Meme Page is not ready yet
           {/** <div className="meme-container">
                <div className="emblameme">
                    <div className="emblaviewport" ref={emblaRef}>
                        <div className="emblacontainer">
                            {memes.map((meme, index) => (
                                <div
                                    key={meme._id}
                                    className="emblaslide"
                                    data-id={meme._id}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <MemeItem 
                                        meme={meme} 
                                        className="emblaslidenumber"
                                        videoRef={(ref) => videoRefs.current[index] = ref} // Save each video ref
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>*/}
        </div>
    );
};

export default MemeList;
