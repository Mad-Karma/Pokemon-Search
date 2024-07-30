import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const renderWithQueryClient = (ui) => {
  return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
  );
};

test('Renders the information about Pikachu after a search for "pikachu"', async () => {
  renderWithQueryClient(<App />);

  fireEvent.change(screen.getByPlaceholderText(/Enter the Pokémon name/i), {
    target: { value: 'pikachu' }
  });

  fireEvent.click(screen.getByRole('button', { name: /search/i }));

  await waitFor(() => {
    expect(screen.getByText(/Pikachu/i)).toBeInTheDocument();
  },{ timeout: 5000 });
});


test('Renders the information about Pikachu after a search for "pikac"', async () => {
  renderWithQueryClient(<App />);

  // Simula a digitação no campo de pesquisa
  fireEvent.change(screen.getByPlaceholderText(/Enter the Pokémon name/i), {
    target: { value: 'pikac' }
  });

  // Simula o clique no botão de pesquisa
  fireEvent.click(screen.getByRole('button', { name: /search/i }));

  await waitFor(() => {
    expect(screen.getByText(/Pikachu/i)).toBeInTheDocument();
  }, { timeout: 5000 });
});


test('Renders the information about Raichu after a search for "pikac" followed by clicking in the button "Next"', async () => {
  renderWithQueryClient(<App />);

  fireEvent.change(screen.getByPlaceholderText(/Enter the Pokémon name/i), {
    target: { value: 'pikac' }
  });

  // Simula o clique no botão de pesquisa
  fireEvent.click(screen.getByRole('button', { name: /search/i }));

  await waitFor(() => {
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  }, { timeout: 5000 });

  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() => {
    expect(screen.getByText(/Raichu/i)).toBeInTheDocument();
  }, { timeout: 5000 });
});


test('Renders the information about Arbok after a search for "pikac" followed by clicking in the button "Previous"', async () => {
  renderWithQueryClient(<App />);

  fireEvent.change(screen.getByPlaceholderText(/Enter the Pokémon name/i), {
    target: { value: 'pikac' }
  });

  // Simula o clique no botão de pesquisa
  fireEvent.click(screen.getByRole('button', { name: /search/i }));

  await waitFor(() => {
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  }, { timeout: 5000 });

  fireEvent.click(screen.getByRole('button', { name: /previous/i }));

  await waitFor(() => {
    expect(screen.getByText(/Arbok/i)).toBeInTheDocument();
  }, { timeout: 5000 });
});