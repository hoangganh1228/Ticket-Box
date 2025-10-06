import Link from 'next/link';

export default function Logo({ size = 'lg' }: { size?: 'lg' | 'md' | 'sm' }) {
  const classes =
    size === 'lg'
      ? 'text-3xl font-bold tracking-wide'
      : size === 'md'
      ? 'text-2xl font-bold tracking-wide'
      : 'text-xl font-bold tracking-wide';

  return (
    <Link href="/" className="flex-shrink-0">
      <h1 className={classes}>ticketbox</h1>
    </Link>
  );
}