import { FC, useEffect } from 'react';
import { useSession } from '../store/session';
import { navigationRef } from './services';

export const SessionWatcher: FC = () => {
  useEffect(
    () =>
      useSession.subscribe((state, previous) => {
        const signedOut = previous.tokens && !state.tokens && !state.isGuest;
        const leftGuest = previous.isGuest && !state.isGuest && !state.tokens;
        if ((signedOut || leftGuest) && navigationRef.isReady()) {
          navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }),
    [],
  );
  return null;
};
