import { useEffect } from 'react';
import * as Linking  from 'expo-linking';
import { useRouter } from 'expo-router';

/**
 * Handles incoming deep links of the form:
 *   soroprotocol://stream/123
 *   soroprotocol://vesting/456
 */
export function useDeepLink() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const parsed  = Linking.parse(url);
      const { path } = parsed;
      if (!path) return;

      if (path.startsWith('stream/')) {
        const id = path.split('/')[1];
        router.push(`/stream/${id}`);
      } else if (path.startsWith('vesting/')) {
        const id = path.split('/')[1];
        router.push(`/vesting/${id}`);
      }
    });

    return () => subscription.remove();
  }, [router]);
}
