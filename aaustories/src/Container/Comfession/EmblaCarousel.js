import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import ClassNames from 'embla-carousel-class-names';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import axios from 'axios';
import './comfession.css';

const EmblaCarousel = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [ClassNames()]);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const MAX_TEXT_LENGTH = 550;

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  // Fetch read confession IDs from localStorage
  const getReadConfessions = () => {
    const readConfessions = localStorage.getItem('readConfessions');
    return readConfessions ? JSON.parse(readConfessions) : [];
  };

  // Save read confession ID in localStorage
  const markAsRead = (confessionId) => {
    const readConfessions = getReadConfessions();
    const updatedReadConfessions = [...readConfessions, confessionId];
    localStorage.setItem('readConfessions', JSON.stringify(updatedReadConfessions));
  };

  const fetchConfessions = async () => {
    setLoading(true);
    try {
      const readConfessions = getReadConfessions(); // Get list of read confessions
      const response = await axios.post('http://localhost:5000/api/users/get-random-confessions', {
        exclude: readConfessions // Send read confessions to backend to exclude
      });
      setConfessions(response.data);
    } catch (error) {
      console.error('Error fetching confessions:', error);
      setError('Could not fetch confessions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleCommentAdded = (updatedConfession) => {
    setConfessions((prev) =>
      prev.map((confession) =>
        confession._id === updatedConfession._id ? updatedConfession : confession
      )
    );
  };

  const handleReadMore = (id) => {
    markAsRead(id); // Mark confession as read
    navigate(`/confession/${id}`); // Redirect to full confession page
  };

  if (loading) return <div className="embla_">Loading confessions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="embla_">
      <div className="embla___viewport" ref={emblaRef}>
        <div className="embla___container">
          {confessions.map((confession) => (
            <div key={confession._id} className='embla___slide embla___class-names'>
              <p>
                {confession.text.length > MAX_TEXT_LENGTH
                  ? `${confession.text.substring(0, MAX_TEXT_LENGTH)}...`
                  : confession.text}
              </p>
              {confession.text.length > MAX_TEXT_LENGTH && (
                <button onClick={() => handleReadMore(confession._id)} className="read-more-button">
                  Read More
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="embla___controls">
        <div className="embla___buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
