import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
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
  const navigate = useNavigate(); // Create history object for navigation

  const MAX_TEXT_LENGTH = 550; // Set your character limit here

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  const fetchConfessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/get-all-confessions');
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
    navigate(`/confession/${id}`); // Redirect to the full confession page
  };

  if (loading) return <div  className="embla_">Loading confessions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="embla_">
      <div className="embla___viewport" ref={emblaRef}>
        <div className="embla___container">
          {confessions.map((confession) => (
            <div key={confession._id} className='embla___slide embla___class-names'>
              <p>
                {confession.text.length > MAX_TEXT_LENGTH
                  ? `${confession.text.substring(0, MAX_TEXT_LENGTH)}...` // Show limited text
                  : confession.text}
              </p>
              {confession.text.length > MAX_TEXT_LENGTH && ( // Show "Read More" button if text exceeds limit
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
