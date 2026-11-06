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
      const { transition, animate, initial, exit, whileHover, whileTap, whileInView, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    span: ({ children, ...props }: any) => {
      const { transition, animate, initial, exit, whileHover, whileTap, whileInView, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
    h1: ({ children, ...props }: any) => {
      const { transition, animate, initial, exit, whileHover, whileTap, whileInView, ...rest } = props;
      return <h1 {...rest}>{children}</h1>;
    },
    p: ({ children, ...props }: any) => {
      const { transition, animate, initial, exit, whileHover, whileTap, whileInView, ...rest } = props;
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
    
    expect(screen.getByText('Own Your Placement Journey.')).toBeInTheDocument();
    const cockpitTexts = screen.getAllByText('Placement Cockpit', { selector: 'span' });
    expect(cockpitTexts.length).toBeGreaterThan(0);
    
    // Check if the login CTA is present
    expect(screen.getByText('Initialize OS Cockpit')).toBeInTheDocument();
  });

  it('shows Enter Dashboard when logged in', () => {
    mockContextValue = {
      state: { user: { uid: '123', name: 'Test User' } },
      loginUser: mockLoginUser
    };

    render(<LandingView onEnterDashboard={mockOnEnterDashboard} />);
    
    const dashboardButtons = screen.getAllByText('Enter Dashboard');
    expect(dashboardButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(dashboardButtons[0]);
    expect(mockOnEnterDashboard).toHaveBeenCalled();
  });

  it('opens the login modal when clicking Access Cockpit', async () => {
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
    expect(await screen.findByText('Developer Guest Mode')).toBeInTheDocument();
  });
});
