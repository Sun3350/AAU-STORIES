import React, { useState } from 'react';
import axios from 'axios';

const MemeUpload = () => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('caption', caption);

        await axios.post('http://localhost:5000/api/memes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setCaption('');
        setFile(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} required />
            <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption"
                required
            />
            <button type="submit">Upload Meme</button>
        </form>
    );
};

export default MemeUpload;
