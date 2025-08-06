import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CursorEyes = () => {
  const eyesRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (leftPupilRef.current && rightPupilRef.current) {
      const leftPupil = leftPupilRef.current;
      const rightPupil = rightPupilRef.current;
      
      const movePupils = () => {
        const rect = eyesRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center
        const deltaX = mousePosition.x - centerX;
        const deltaY = mousePosition.y - centerY;
        
        // Calculate movement range for pupils (limited to eye boundaries)
        const maxMoveX = 15;
        const maxMoveY = 10;
        
        const moveX = Math.max(-maxMoveX, Math.min(maxMoveX, deltaX * 0.1));
        const moveY = Math.max(-maxMoveY, Math.min(maxMoveY, deltaY * 0.1));
        
        // Animate both pupils
        gsap.to([leftPupil, rightPupil], {
          x: moveX,
          y: moveY,
          duration: 0.2,
          ease: "power2.out"
        });
      };

      movePupils();
    }
  }, [mousePosition]);

  return (
    <section className="simple-eyes-section">
      <div className="eyes-container" ref={eyesRef}>
        <div className="eye left-eye">
          <div className="pupil" ref={leftPupilRef}>
            <div className="highlight"></div>
          </div>
        </div>
        <div className="eye right-eye">
          <div className="pupil" ref={rightPupilRef}>
            <div className="highlight"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .simple-eyes-section {
          padding: 100px 0;
          background: #2d2d2d;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          position: relative;
        }

        .eyes-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 60px;
          padding: 40px;
        }

        .eye {
          width: 200px;
          height: 200px;
          background: white;
          border-radius: 50%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .pupil {
          width: 85px;
          height: 85px;
          background: black;
          border-radius: 50%;
          position: relative;
          transition: all 0.2s ease;
        }

        .highlight {
          position: absolute;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .eyes-container {
            gap: 40px;
            padding: 30px;
          }

          .eye {
            width: 150px;
            height: 150px;
          }

          .pupil {
            width: 65px;
            height: 65px;
          }

          .highlight {
            width: 12px;
            height: 12px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        @media (max-width: 480px) {
          .eyes-container {
            gap: 30px;
          }

          .eye {
            width: 120px;
            height: 120px;
          }

          .pupil {
            width: 50px;
            height: 50px;
          }

          .highlight {
            width: 10px;
            height: 10px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </section>
  );
};

export default CursorEyes; 