// Removed unused React import
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingView } from './LandingView';
import { useAppState } from '../context/AppStateContext';

// Mock the context hook
vi.mock('../context/AppStateContext', () => ({
  useAppState: vi.fn()
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    circle: ({ children, ...props }: any) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('LandingView', () => {
  const mockOnEnterDashboard = vi.fn();
  const mockLoginUser = vi.fn();

  it('renders the initial state (logged out)', () => {
    (useAppState as any).mockReturnValue({
      state: { user: null },
      loginUser: mockLoginUser
    });

    render(<LandingView onEnterDashboard={mockOnEnterDashboard} />);
    
    expect(screen.getByText('Command Your Journey on')).toBeInTheDocument();
    const cockpitTexts = screen.getAllByText('Placement Cockpit', { selector: 'span' });
    expect(cockpitTexts.length).toBeGreaterThan(0);
    
    // Check if the login CTA is present
    expect(screen.getAllByText(/Access Cockpit|Go to Dashboard/)).toHaveLength(2);
  });

  it('shows Go to Dashboard when logged in', () => {
    (useAppState as any).mockReturnValue({
      state: { user: { uid: '123', name: 'Test User' } },
      loginUser: mockLoginUser
    });

    render(<LandingView onEnterDashboard={mockOnEnterDashboard} />);
    
    const dashboardButtons = screen.getAllByText('Go to Dashboard');
    expect(dashboardButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(dashboardButtons[0]);
    expect(mockOnEnterDashboard).toHaveBeenCalled();
  });

  it('opens the login modal when clicking Go to Dashboard', () => {
    (useAppState as any).mockReturnValue({
      state: { user: null },
      loginUser: mockLoginUser
    });

    render(<LandingView onEnterDashboard={mockOnEnterDashboard} />);
    
    const initBtn = screen.getAllByText('Go to Dashboard')[0];
    fireEvent.click(initBtn);
    
    // Check if the modal title is there
    expect(screen.getByText('Access Placement Cockpit')).toBeInTheDocument();
    expect(screen.getByText('Continue in Developer Guest Mode')).toBeInTheDocument();
  });
});
