import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 text-sm text-white mb-6">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-[var(--accent-color)] transition-colors flex items-center gap-1">
            <Home size={14} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-white" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[var(--accent-color)] transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-semibold truncate max-w-[200px] md:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
