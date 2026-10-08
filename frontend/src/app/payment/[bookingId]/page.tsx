import Payment from '../../../views/Payment';

export function generateStaticParams() {
  return [{ bookingId: 'sample' }];
}

export default function Page() {
  return <Payment />;
}
