import { ScribeDetailHeader } from "./scribe-detail-header"
import { ScribeDetailTabs } from "./scribe-detail-tabs"
import type { Consultation } from "@workspace/features/scribe/types"

export interface ScribeDetailProps {
  consultation: Consultation
  isListVisible: boolean
  onToggleList: () => void
  isMobile?: boolean
}

export function ScribeDetail({
  consultation,
  isListVisible,
  onToggleList,
  isMobile = false,
}: ScribeDetailProps) {
  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-4 gap-6">
      <ScribeDetailHeader
        consultation={consultation}
        isListVisible={isListVisible}
        onToggleList={onToggleList}
        isMobile={isMobile}
      />
      <div className="flex-1 min-h-0">
        <ScribeDetailTabs consultation={consultation} />
      </div>
    </div>
  )
}
