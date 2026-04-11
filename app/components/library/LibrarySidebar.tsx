import { Link } from "react-router";

import { LuminousPanel } from "~/components/ui/luminous-panel";

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
    <LuminousPanel
      as="aside"
      aria-label="Saved lists"
      className="library-sidebar"
      tone="ink"
    >
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
    </LuminousPanel>
  );
}
