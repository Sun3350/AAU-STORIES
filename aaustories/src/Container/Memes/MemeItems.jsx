import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './meme.css';

const MemeItem = ({ meme }) => {
    const [likeCount, setLikeCount] = useState(meme.likes); // State for likes

    const handleLike = async () => {
        try {
            await axios.post(`http://localhost:5000/api/users/meme/${meme._id}/like`);
            setLikeCount((prevCount) => prevCount + 1); // Update the like count locally
        } catch (error) {
            console.error('Failed to like the meme:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        const comment = { username: 'Anonymous', text: e.target.comment.value };
        try {
            await axios.post(`http://localhost:5000/api/users/meme/${meme._id}/comment`, comment);
            e.target.comment.value = '';
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current.play();
                        setIsPlaying(true);
                        setIsVisible(true);
                    } else {
                        videoRef.current.pause();
                        setIsPlaying(false);
                        setIsVisible(false);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className='relative w-full h-full content-container'>
            {meme.type === 'video' ? (
                <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                    <video
                        ref={videoRef}
                        src={meme.url}
                        loop
                        style={{ width: '100%', height: 'auto' }}
                        onClick={togglePlayPause}
                    />
                    <button
                        onClick={togglePlayPause}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: 'none',
                            borderRadius: '50%',
                            color: 'white',
                            fontSize: '24px',
                            padding: '10px',
                            cursor: 'pointer',
                            display: isVisible ? 'block' : 'none',
                        }}
                    >
                        {isPlaying ? '' : 'Play'}
                    </button>
                </div>
            ) : (
                <img src={meme.url} alt={meme.caption} style={{ width: '100%', height: 'auto' }} />
            )}
            <div className='absolute bottom-0 top-0 h-full w-full p-2 rounded items-end flex'>
                <div style={{width: '95%', height:'20vh'}} className='bg-black'>
                <h3>{meme.caption}</h3>
                </div>
               <div className='flex flex-col justify-center items-center' style={{width:'20%'}}>
               <button className='like-btn' onClick={handleLike}>Like ({likeCount})</button>
                <a href={meme.url} download style={{ marginTop: '10px', display: 'inline-block' }}>
                    <button>Download Meme</button>
                </a>
               </div>
               
            </div>
        </div>
    );
};

export default MemeItem;
