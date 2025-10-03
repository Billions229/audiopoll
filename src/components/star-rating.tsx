'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  totalStars?: number;
  value: number;
  onChange: (rating: number) => void;
};

export default function StarRating({ totalStars = 5, value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              className="sr-only"
              value={ratingValue}
              checked={ratingValue === value}
              onChange={() => onChange(ratingValue)}
            />
            <Star
              className={cn(
                'h-8 w-8 cursor-pointer transition-colors duration-200',
                ratingValue <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'
              )}
              fill={ratingValue <= (hover || value) ? 'currentColor' : 'none'}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange(ratingValue)}
            />
          </label>
        );
      })}
    </div>
  );
}
