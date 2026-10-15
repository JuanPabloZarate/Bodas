import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Countdown } from '@/components/ui/countdown';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { BottomNav } from '@/components/navigation/bottom-nav';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Atomic UI Primitives', () => {
  it('renders Button with variants and handles clicks', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Confirm Attendance
      </Button>
    );

    const btn = screen.getByRole('button', { name: /confirm attendance/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('bg-primary');

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled Button and prevents interaction', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Action
      </Button>
    );

    const btn = screen.getByRole('button', { name: /disabled action/i });
    expect(btn).toBeDisabled();

    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders Card with cathedral arch geometry and double border', () => {
    const { container } = render(
      <Card arch="cathedral" doubleBorder data-testid="test-card">
        <CardHeader>
          <CardTitle>Villa Bellissima</CardTitle>
        </CardHeader>
        <CardContent>Chianti Valley</CardContent>
      </Card>
    );

    const card = container.querySelector('[data-testid="test-card"]');
    expect(card).toHaveClass('rounded-t-[220px]');
    expect(card).toHaveClass('rounded-b-2xl');
    expect(screen.getByText('Villa Bellissima')).toBeInTheDocument();
    expect(screen.getByText('Chianti Valley')).toBeInTheDocument();
  });

  it('renders Badge with variants and pulse dot', () => {
    render(
      <Badge variant="sage" dot pulseDot>
        Confirmed
      </Badge>
    );

    const badge = screen.getByText(/confirmed/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary-fixed');
  });

  it('renders Input with label, placeholder, and handles changes', () => {
    const handleChange = vi.fn();
    render(
      <Input
        label="Guest Passcode"
        placeholder="e.g. JP-8421"
        onChange={handleChange}
      />
    );

    const label = screen.getByText('Guest Passcode');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('e.g. JP-8421');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'JP-8421' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders Input with error state', () => {
    render(<Input label="Name" error="Name is required" />);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('renders Select with options and handles changes', () => {
    const handleChange = vi.fn();
    render(
      <Select label="Attendance" onChange={handleChange} data-testid="status-select">
        <option value="confirmed">Attending with Joy</option>
        <option value="declined">Regretfully Decline</option>
      </Select>
    );

    expect(screen.getByText('Attendance')).toBeInTheDocument();
    const select = screen.getByTestId('status-select');
    fireEvent.change(select, { target: { value: 'declined' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders Textarea with label and rows', () => {
    render(<Textarea label="Dietary Notes" placeholder="Allergies or dietary wishes" rows={3} />);
    expect(screen.getByText('Dietary Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Allergies or dietary wishes')).toBeInTheDocument();
  });

  it('renders Modal when isOpen=true and closes on button click', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="RSVP Confirmation">
        <p>Please confirm your details</p>
      </Modal>
    );

    expect(screen.getByText('RSVP Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your details')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render Modal content when isOpen=false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Hidden Dialog">
        <p>Hidden body</p>
      </Modal>
    );

    expect(screen.queryByText('Hidden Dialog')).not.toBeInTheDocument();
  });

  it('renders Countdown component with 4 time units', () => {
    render(<Countdown targetDate="2026-11-26T15:30:00" />);
    expect(screen.getByText('Villa Bellissima')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Mins')).toBeInTheDocument();
    expect(screen.getByText('Secs')).toBeInTheDocument();
  });
});

describe('Accessibility & Lifecycle Regressions', () => {
  // --- FORM ACCESSIBILITY & ARIA ATTRIBUTES ---

  it('renders Input with aria-invalid, aria-describedby, and role="alert" when error is present', () => {
    render(<Input label="Passcode" error="Passcode must be 6 characters" data-testid="aria-input" />);
    const input = screen.getByTestId('aria-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'passcode-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'passcode-error');
    expect(errorAlert).toHaveTextContent('Passcode must be 6 characters');
  });

  it('renders Input with helperText and aria-describedby when no error', () => {
    render(<Input label="Passcode" helperText="Check your formal invitation" data-testid="aria-input-helper" />);
    const input = screen.getByTestId('aria-input-helper');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('aria-describedby', 'passcode-helper');
    expect(screen.getByText('Check your formal invitation')).toHaveAttribute('id', 'passcode-helper');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders Select with aria-invalid, aria-describedby, and role="alert" when error is present', () => {
    render(
      <Select label="Course" error="Selection required" data-testid="aria-select">
        <option value="">Select menu</option>
        <option value="veg">Vegetarian</option>
      </Select>
    );
    const select = screen.getByTestId('aria-select');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby', 'course-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'course-error');
    expect(errorAlert).toHaveTextContent('Selection required');
  });

  it('renders Select with helperText and aria-describedby when no error', () => {
    render(
      <Select label="Course" helperText="Tuscan four-course dinner" data-testid="aria-select-helper">
        <option value="veg">Vegetarian</option>
      </Select>
    );
    const select = screen.getByTestId('aria-select-helper');
    expect(select).toHaveAttribute('aria-invalid', 'false');
    expect(select).toHaveAttribute('aria-describedby', 'course-helper');
    expect(screen.getByText('Tuscan four-course dinner')).toHaveAttribute('id', 'course-helper');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders Textarea with aria-invalid, aria-describedby, and role="alert" when error is present', () => {
    render(<Textarea label="Notes" error="Note exceeds maximum length" data-testid="aria-textarea" />);
    const textarea = screen.getByTestId('aria-textarea');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'notes-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'notes-error');
    expect(errorAlert).toHaveTextContent('Note exceeds maximum length');
  });

  it('renders Textarea with helperText and aria-describedby when no error', () => {
    render(<Textarea label="Notes" helperText="Allergies or transport needs" data-testid="aria-textarea-helper" />);
    const textarea = screen.getByTestId('aria-textarea-helper');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
    expect(textarea).toHaveAttribute('aria-describedby', 'notes-helper');
    expect(screen.getByText('Allergies or transport needs')).toHaveAttribute('id', 'notes-helper');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // --- COUNTDOWN TIMING LIFECYCLE & PAST DATES ---

  it('Countdown terminates timer and calls onFinish only once for elapsed past date', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    render(<Countdown targetDate="2020-01-01T00:00:00" onFinish={onFinish} />);
    expect(onFinish).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    // Interval must be cleared and onFinish never called repeatedly
    expect(onFinish).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('Countdown transitions from running to complete and halts interval', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    const futureDate = new Date(Date.now() + 2000).toISOString();
    render(<Countdown targetDate={futureDate} onFinish={onFinish} />);
    expect(onFinish).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('Countdown handles invalid date string safely without rendering NaN', () => {
    render(<Countdown targetDate="invalid-date-format" />);
    expect(screen.queryByText('NaN')).not.toBeInTheDocument();
  });

  // --- MODAL FOCUS TRAPPING & ACCESSIBILITY ---

  it('Modal traps keyboard focus cycling forward on Tab and backward on Shift+Tab', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Dialog">
        <input data-testid="modal-input" placeholder="Guest" />
        <button data-testid="modal-action-btn">Confirm</button>
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    const modalInput = screen.getByTestId('modal-input');
    const modalAction = screen.getByTestId('modal-action-btn');

    // Initial focus must be inside modal
    expect(document.activeElement).toBe(closeBtn);

    // Tab wrap test: focus last element, press Tab -> should wrap to first element
    modalAction.focus();
    expect(document.activeElement).toBe(modalAction);
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    // Shift+Tab wrap test: focus first element, press Shift+Tab -> should wrap to last element
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(modalAction);
  });

  it('Modal restores focus to trigger element when closed', () => {
    function ModalWithTrigger() {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div>
          <button data-testid="open-trigger" onClick={() => setIsOpen(true)}>
            Open
          </button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Restoration">
            <p>Body</p>
          </Modal>
        </div>
      );
    }

    render(<ModalWithTrigger />);
    const trigger = screen.getByTestId('open-trigger');
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    expect(document.activeElement).toBe(closeBtn);

    // Close via ESC
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Navigation Layout Shell', () => {
  it('renders Header with brand initials, title and navigation links', () => {
    render(<Header />);
    expect(screen.getByText('J&P')).toBeInTheDocument();
    expect(screen.getByText('Atelier Nuptial')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /invitation/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /guest pass/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /wedding pulse/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /admin atelier/i })[0]).toBeInTheDocument();
  });

  it('renders Footer with couple inscription and celebration cards', () => {
    render(<Footer />);
    expect(screen.getByText('Julia Rossi & Pedro Silva')).toBeInTheDocument();
    expect(screen.getByText('Celebration Details')).toBeInTheDocument();
    expect(screen.getByText('Guest Concierge & Transit')).toBeInTheDocument();
    expect(screen.getByText('Inquiries & Assistance')).toBeInTheDocument();
  });

  it('renders BottomNav with 5 mobile tab touch targets', () => {
    render(<BottomNav />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pass/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pulse/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });
});
