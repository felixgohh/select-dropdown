import { PortalProvider } from '../src/contexts/portal';

export const decorators = [
  (Story) => (
    <PortalProvider>
      <Story />
    </PortalProvider>
  ),
];
