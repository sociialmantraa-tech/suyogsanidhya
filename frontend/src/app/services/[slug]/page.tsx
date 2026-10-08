import ServiceDetail from '../../../views/ServiceDetail';
import { demoServices } from '../../../data/demoServices';

export function generateStaticParams() {
  return demoServices.map((s) => ({ slug: s.slug }));
}

export default function Page() {
  return <ServiceDetail />;
}
