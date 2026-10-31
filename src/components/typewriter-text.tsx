'use client';

import { useEffect, useState } from 'react';

export function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
        setComplete(true);
      }
    }, 65);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayed}
        <span className={`typewriter-cursor${complete ? ' is-complete' : ''}`} />
      </span>
    </>
  );
}
