import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('Bug Tracker App', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Zippy Royalty Bugger')).toBeInTheDocument();
  });

  test('allows entering bug title', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter bug title...');
    fireEvent.change(input, { target: { value: 'New bug' } });
    expect(input.value).toBe('New bug');
  });

  test('submits a new bug', async () => {
    const mockBug = { _id: '1', title: 'New bug', status: 'open' };
    
    global.fetch
      .mockImplementationOnce(() => 
        Promise.resolve({ json: () => Promise.resolve([mockBug]), ok: true })
      )
      .mockImplementationOnce(() => 
        Promise.resolve({ json: () => Promise.resolve(mockBug), ok: true })
      );

    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter bug title...');
    fireEvent.change(input, { target: { value: 'New bug' } });
    fireEvent.click(screen.getByText('Report Bug'));

    await waitFor(() => {
      expect(screen.getByText('New bug')).toBeInTheDocument();
    });
  });

  test('shows error when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });
});