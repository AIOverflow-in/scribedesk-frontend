import type { QueryClient } from "@tanstack/react-query"
import type { ConversationListItem } from "@workspace/schemas/chat"

interface ChatTitleGeneratedData {
  conv_id: string
  title: string
}

export function handleChatTitleGenerated(
  data: ChatTitleGeneratedData,
  ctx: { queryClient: QueryClient }
) {
  const { conv_id, title } = data
  const { queryClient } = ctx

  queryClient.setQueriesData<{ items: ConversationListItem[] }>(
    { queryKey: ["conversations"], type: "all" },
    (old) => {
      if (!old?.items) return old
      return {
        ...old,
        items: old.items.map((c) =>
          c.id === conv_id
            ? { ...c, title, is_title_generated: true }
            : c
        ),
      }
    }
  )

  queryClient.setQueryData<{ title: string; is_title_generated: boolean }>(
    ["conversation", conv_id],
    (old) => {
      if (!old) return old
      return { ...old, title, is_title_generated: true }
    }
  )

  queryClient.invalidateQueries({ queryKey: ["conversations"] })
}
