import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoryCard } from './story-card';
import { getStories } from '@/content/queries';

describe('StoryCard', () => {
  it('shows kicker, linked headline, credit and deck', () => {
    const story = getStories()[0];
    render(<StoryCard project={story} />);
    expect(screen.getByText(story.kicker)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: story.title });
    expect(link).toHaveAttribute('href', `/work/${story.slug}`);
    expect(screen.getByRole('heading', { level: 3 })).toContainElement(link);
    expect(screen.getByText(story.credit)).toBeInTheDocument();
    expect(screen.getByText(story.deck)).toBeInTheDocument();
  });
  it('stamps a winning project and leaves the others plain', () => {
    const [qiskit, gold] = getStories();
    const { container, rerender } = render(<StoryCard project={qiskit} />);
    expect(container.querySelector('.stamp')).toHaveTextContent('Winner');
    rerender(<StoryCard project={gold} />);
    expect(container.querySelector('.stamp')).toBeNull();
  });
});
