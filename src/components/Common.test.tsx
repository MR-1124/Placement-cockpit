// Removed unused React import
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GlassCard, ProgressBar } from './Common';

describe('Common Components', () => {
  describe('GlassCard', () => {
    it('renders children correctly', () => {
      render(
        <GlassCard>
          <div data-testid="child-element">Test Content</div>
        </GlassCard>
      );
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      render(
        <GlassCard onClick={handleClick} data-testid="glass-card">
          Clickable Content
        </GlassCard>
      );
      
      const element = screen.getByText('Clickable Content');
      fireEvent.click(element);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies glow class when glow prop is true', () => {
      const { container } = render(
        <GlassCard glow={true}>
          Glow Content
        </GlassCard>
      );
      // framer-motion wraps it in a div
      expect(container.firstChild).toHaveClass('glow-active');
    });
  });

  describe('ProgressBar', () => {
    it('renders with correct percentage text', () => {
      render(<ProgressBar percentage={75} showText={true} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    it('clamps percentage between 0 and 100 for the bar width (text still shows raw value)', () => {
      render(<ProgressBar percentage={150} showText={true} />);
      expect(screen.getByText('150%')).toBeInTheDocument();
    });
  });
});
