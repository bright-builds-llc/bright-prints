import { Link } from "react-router";

type LibrarySidebarProps = {
  lists: Array<{
    count: number;
    id: string;
    isSelected: boolean;
    kind: "BOOKMARKS" | "CUSTOM";
    name: string;
  }>;
};

export function LibrarySidebar({ lists }: LibrarySidebarProps) {
  return (
    <aside className="library-sidebar" aria-label="Saved lists">
      <p className="eyebrow">Lists</p>
      <div className="library-sidebar-links">
        {lists.map((list) => (
          <Link
            key={list.id}
            className={`library-sidebar-link ${list.isSelected ? "library-sidebar-link-active" : ""}`}
            prefetch="intent"
            to={`/library?list=${list.id}`}
          >
            <span>{list.name}</span>
            <span>{list.count}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
