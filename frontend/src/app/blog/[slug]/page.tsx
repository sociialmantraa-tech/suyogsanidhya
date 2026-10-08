import BlogDetail from '../../../views/BlogDetail';
import { demoBlogs } from '../../../data/demoBlogs';

export function generateStaticParams() {
  return demoBlogs.map((b) => ({ slug: b.slug }));
}

export default function Page() {
  return <BlogDetail />;
}
