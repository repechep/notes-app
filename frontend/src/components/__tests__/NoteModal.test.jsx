import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteModal from '../NoteModal';

const mockOnSave = vi.fn();
const mockOnClose = vi.fn();

describe('NoteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create modal correctly', () => {
    render(<NoteModal onSave={mockOnSave} onClose={mockOnClose} />);
    
    expect(screen.getByText('Create New Note')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<NoteModal onSave={mockOnSave} onClose={mockOnClose} />);
    
    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title and content are required/i)).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('calls onSave with correct data', async () => {
    render(<NoteModal onSave={mockOnSave} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Note' }
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'New content' }
    });

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'New Note',
        content: 'New content',
        tags: []
      });
    });
  });
});