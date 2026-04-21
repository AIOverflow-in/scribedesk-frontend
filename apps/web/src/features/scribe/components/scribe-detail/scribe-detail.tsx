import { ScrollArea } from "@workspace/ui/components/scroll-area"
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
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="px-4 pt-2 pb-4 space-y-4">
          <ScribeDetailHeader
            consultation={consultation}
            isListVisible={isListVisible}
            onToggleList={onToggleList}
            isMobile={isMobile}
          />
          <ScribeDetailTabs consultation={consultation} />
        </div>
      </ScrollArea>
    </div>
  )
}
