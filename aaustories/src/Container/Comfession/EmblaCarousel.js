import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import ClassNames from 'embla-carousel-class-names';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import axios from 'axios';
import './comfession.css';

const EmblaCarousel = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options); // Normal initialization
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [maxTextLength, setMaxTextLength] = useState(550);

  useEffect(() => {
    const updateTextLength = () => {
      if (window.innerWidth <= 768) {
        setMaxTextLength(400); // Set a smaller max length for mobile screens
      } else if(window.innerWidth <= 550) {
        setMaxTextLength(300); // Default max length for larger screens
      }else{
        setMaxTextLength(550);
    }
    };

    updateTextLength(); // Check once on component mount
    window.addEventListener('resize', updateTextLength); // Update on resize

    return () => window.removeEventListener('resize', updateTextLength);
  }, []);


  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // Initialize ClassNames after emblaApi is set
  

 

  const fetchConfessions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://aau-stories-sever.vercel.app/api/users/get-random-confessions',
      
      );
      setConfessions(response.data);
    } catch (error) {
      console.error('Error fetching confessions:', error);
      setError('No Confessions. Please check back later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [confessions, emblaApi]);

  const handleReadMore = (id) => {
   
    navigate(`/confession/${id}`);
  };

  if (loading) return <div className="embla_">Loading confessions...</div>;
  if (error) return <div className="embla_">{error}</div>;

  return (
    <div className="embla_">
      <div className="embla___viewport" ref={emblaRef}>
        <div className="embla___container">
          
        {confessions.map((confession) => (
  <div key={confession._id} className="embla___slide ">
    <div className='embla___slide___number'>
    <p className='text-white comfession-text'>
{confession.text.length > maxTextLength
? `${confession.text.substring(0, maxTextLength)}...`
: confession.text}
</p>
    {confession.text.length > maxTextLength && (
      <div
        onClick={() => handleReadMore(confession._id)}
        className="read-more-buttons"
      >
        Read More
      </div>
    )}
  </div>
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
