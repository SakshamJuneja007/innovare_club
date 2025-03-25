//@ts-nocheck
'use client';
import { type JSX, useEffect, useState } from 'react';
import { motion, MotionProps } from 'framer-motion';

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
  scrambleOnHover?: boolean;
  scrambleOnScroll?: boolean;
  wordByWord?: boolean;
  speedRange?: { min: number; max: number };
  glowColor?: string;
} & MotionProps;

const defaultChars = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  binary: '01',
  hex: '0123456789ABCDEF',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  matrix: '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ',
  custom: ''
};

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = 'alphanumeric',
  className,
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  scrambleOnHover = false,
  scrambleOnScroll = false,
  wordByWord = false,
  speedRange,
  glowColor = '#CFFB2D',
  ...props
}: TextScrambleProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const text = children;

  const [isHovered, setIsHovered] = useState(false);
  const chars = typeof characterSet === 'string' ? 
    defaultChars[characterSet as keyof typeof defaultChars] || characterSet :
    characterSet;

  const getRandomSpeed = () => {
    if (!speedRange) return speed;
    return Math.random() * (speedRange.max - speedRange.min) + speedRange.min;
  };

  const scrambleWord = async (word: string, currentSpeed: number) => {
    return new Promise<string>((resolve) => {
      let step = 0;
      const steps = duration / currentSpeed;
      let result = '';

      const interval = setInterval(() => {
        const progress = step / steps;
        result = '';

        for (let i = 0; i < word.length; i++) {
          if (progress * word.length > i) {
            result += word[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        if (step > steps) {
          clearInterval(interval);
          resolve(word);
        }
        step++;
      }, currentSpeed * 1000);
    });
  };

  const scramble = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (wordByWord) {
      const words = text.split(' ');
      let scrambledText = '';

      for (let i = 0; i < words.length; i++) {
        const word = await scrambleWord(words[i], getRandomSpeed());
        scrambledText += word + (i < words.length - 1 ? ' ' : '');
        setDisplayText(scrambledText);
      }
    } else {
      await scrambleWord(text, speed);
    }

    setDisplayText(text);
    setIsAnimating(false);
    onScrambleComplete?.();
  };

  useEffect(() => {
    if (!trigger) return;
    scramble();
  }, [trigger]);

  useEffect(() => {
    if (!scrambleOnScroll) return;

    const handleScroll = () => {
      const element = document.querySelector(`[data-scramble="${text}"]`);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isVisible && !isAnimating) {
        scramble();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrambleOnScroll, text]);

  return (
    <MotionComponent
      className={className}
      data-scramble={text}
      onMouseEnter={() => scrambleOnHover && setIsHovered(true)}
      onMouseLeave={() => scrambleOnHover && setIsHovered(false)}
      animate={{
        textShadow: isHovered ? `0 0 8px ${glowColor}` : 'none'
      }}
      {...props}
    >
      {displayText}
    </MotionComponent>
  );
}
