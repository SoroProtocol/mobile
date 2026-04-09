import { render } from '@testing-library/react-native';
import { StreamCard } from '../StreamCard';

const props = {
  id: '5',
  recipient: 'GBOB1234567890123456789012345678901234567890123456789012',
  ratePerSecond: 116n,
  startTime: 1000,
  stopTime:  2000,
  cancelled: false,
};

describe('StreamCard', () => {
  it('renders stream id', () => {
    const { getByText } = render(<StreamCard {...props} />);
    expect(getByText('Stream #5')).toBeTruthy();
  });

  it('shows Active badge', () => {
    const { getByText } = render(<StreamCard {...props} />);
    expect(getByText('Active')).toBeTruthy();
  });

  it('shows Cancelled badge when cancelled', () => {
    const { getByText } = render(<StreamCard {...props} cancelled={true} />);
    expect(getByText('Cancelled')).toBeTruthy();
  });
});
