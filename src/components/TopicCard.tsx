import Link from "next/link";
import { cardBase, iconChip, cx, getSectionAccent } from "@/lib/design-tokens";

/**
 * 섹션 인덱스에서 개별 토픽을 보여주는 카드.
 * 소속 섹션(sectionSlug)의 색상 액센트를 받아 아이콘 칩·호버 테두리에 반영한다.
 * (시각 표현만 담당 — 데이터는 props로 받는다.)
 */
interface TopicCardProps {
  href: string;
  title: string;
  description: string;
  sectionSlug: string;
}

export default function TopicCard({
  href,
  title,
  description,
  sectionSlug,
}: TopicCardProps) {
  const accent = getSectionAccent(sectionSlug);
  const Icon = accent.icon;

  return (
    <Link
      href={href}
      className={cx(cardBase, accent.hoverBorder, "flex items-start gap-4")}
    >
      <span className={cx(iconChip, accent.iconWrap, "shrink-0")}>
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <h3 className="mb-1 text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </span>
    </Link>
  );
}
