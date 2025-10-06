import { formatName } from '@/src/helpers/format.helper';
import Link from 'next/link';

type Category = {
  id: number;
  name: string;
  slug: string;
}

export default function BottomNav( props : { categories: Category[] } ) {
  const { categories } = props;

  return (
    <div className="bg-black text-white py-5 pl-16 text-sm">
      <nav className="container mx-auto flex flex-wrap gap-4 max-w-7xl">
        {categories?.map((category) => (
          <Link
            key={category?.id}
            href={`/search?cate=${category.slug}`}
            className="transition-colors duration-200 hover:text-[rgb(45,194,117)]"
          >
            {formatName(category?.name)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
