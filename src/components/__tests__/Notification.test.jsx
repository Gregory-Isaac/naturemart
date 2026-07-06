import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationProvider, useNotification } from '../Notification';

jest.useFakeTimers();

function NotifConsumer() {
  const { addNotification } = useNotification();
  return (
    <div>
      <button onClick={() => addNotification('Success msg', 'success')}>Add Success</button>
      <button onClick={() => addNotification('Info msg', 'info')}>Add Info</button>
    </div>
  );
}

function renderNotif() {
  return render(
    <NotificationProvider>
      <NotifConsumer />
    </NotificationProvider>
  );
}

describe('NotificationProvider', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders children', () => {
    renderNotif();
    expect(screen.getByText('Add Success')).toBeInTheDocument();
  });

  it('displays a success notification', async () => {
    renderNotif();
    await userEvent.click(screen.getByText('Add Success'));
    expect(screen.getByText('Success msg')).toBeInTheDocument();
  });

  it('displays an info notification', async () => {
    renderNotif();
    await userEvent.click(screen.getByText('Add Info'));
    expect(screen.getByText('Info msg')).toBeInTheDocument();
  });

  it('auto-removes notification after timeout', async () => {
    renderNotif();
    await userEvent.click(screen.getByText('Add Success'));
    expect(screen.getByText('Success msg')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Success msg')).not.toBeInTheDocument();
    });
  });
});
