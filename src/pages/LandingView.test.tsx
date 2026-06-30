// Removed unused React import
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingView } from './LandingView';

// Mock the context hook with selector support
let mockContextValue = {
  state: { user: null as any },
  loginUser: () => {}
};

vi.mock('../context/AppStateContext', () => ({
  useAppState: vi.fn((selector) => selector ? selector(mockContextValue) : mockContextValue)
}));

// Mock framer-motion to avoid animation issues in tests and preserve component identity
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { transition, animate, initial, exit, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    span: ({ children, ...props }: any) => {
      const { transition, animate, initial, exit, whileHover, whileTap, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
    h1: ({ children, ...props }: any) => {
      const { transition, animate, initial, exit, whileHover, whileTap, ...rest } = props;
      return <h1 {...rest}>{children}</h1>;
    },
    p: ({ children, ...props }: any) => {
      const { transition, animate, initial, exit, whileHover, whileTap, ...rest } = props;
      return <p {...rest}>{children}</p>;
    }
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('LandingView', () => {
  const mockOnEnterDashboard = vi.fn();
  const mockLoginUser = vi.fn();

  it('renders the initial state (logged out)', () => {
    mockContextValue = {
      state: { user: null },
      loginUser: mockLoginUser
    };

    render(<LandingView onEnterDashboard={mockOnEnterDashboard} />);
    
    expect(screen.getByText('Command Your Journey on')).toBeInTheDocument();
    const cockpitTexts = screen.getAllByText('Placement Cockpit', { selector: 'span' });
    expect(cockpitTexts.length).toBeGreaterThan(0);
    
    // Check if the login CTA is present
    expect(screen.getByText('Initialize Workspace')).toBeInTheDocument();
  });

  it('shows Go to Dashboard when logged in', () => {
    mockContextValue = {
      state: { user: { uid: '123', name: 'Test User' } },
      loginUser: mockLoginUser
    };

    render(<LandingView onEnterDashboard={mockOnEnterDashboard} />);
    
    const dashboardButtons = screen.getAllByText('Go to Dashboard');
    expect(dashboardButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(dashboardButtons[0]);
    expect(mockOnEnterDashboard).toHaveBeenCalled();
  });

  it('opens the login modal when clicking Go to Dashboard', async () => {
    mockContextValue = {
      state: { user: null },
      loginUser: mockLoginUser
    };

    render(<LandingView onEnterDashboard={mockOnEnterDashboard} />);
    
    const initBtn = screen.getByText('Access Cockpit').closest('button');
    if (initBtn) {
      await act(async () => {
        fireEvent.click(initBtn);
      });
    }
    
    // Check if the modal is open
    const titles = await screen.findAllByText('Access Cockpit');
    expect(titles.length).toBeGreaterThan(1); // One in header, one in modal
    expect(await screen.findByText('Developer Guest Mode')).toBeInTheDocument();
  });
});
