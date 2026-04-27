import type { ChatThread, ChatMessage } from "../types"

export const mockThreads: ChatThread[] = [
  {
    id: "chat-1",
    title: "Low-Back Pain in Desk Workers",
    lastMessageSnippet: "The key is alternating between sitting and standing throughout the day.",
    updatedAt: new Date().toISOString(),
    context: { type: 'consultation', id: 'session-1' }
  },
  {
    id: "chat-2",
    title: "ACE Inhibitor Side Effects",
    lastMessageSnippet: "Switch to an ARB like Losartan or Valsartan.",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "chat-3",
    title: "Type 2 Diabetes Management",
    lastMessageSnippet: "Metformin remains the first-line pharmacological treatment.",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "chat-4",
    title: "Post-Op Wound Care",
    lastMessageSnippet: "Monitor for signs of infection: redness, warmth, or drainage.",
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  }
]

export const mockMessages: Record<string, ChatMessage[]> = {
  "chat-1": [
    {
      id: "m1",
      role: 'user',
      content: "Can you summarize the primary causes of low-back pain in desk workers?",
      createdAt: new Date(Date.now() - 100000).toISOString(),
      status: 'sent'
    },
    {
      id: "m2",
      role: 'assistant',
      content: `The most common factor that drives low‑back pain in people who work at desks is **prolonged static sitting combined with sub‑optimal workstation ergonomics**.  

* When office workers sit for many hours without regular posture changes, the lumbar spine is placed in a flexed or slouched position, the lumbar discs are loaded continuously, and the deep trunk‑stabilising muscles become de‑conditioned. This “sedentary‑posture” exposure is repeatedly identified as the dominant risk factor for low‑back pain in this population <cite>1,3,7</cite>.  

* Poor ergonomic set‑up (e.g., a chair without adequate lumbar support, a monitor that is too low or high, a keyboard that forces shoulder elevation) forces the spine into awkward positions and increases mechanical stress on the lumbar joints and soft tissues <cite>1,7</cite>.  

* These mechanical stresses are often compounded by other contributors—such as low‑back muscle endurance deficits, psychosocial strain, and long work hours—but the **primary, upstream cause** remains the combination of long, uninterrupted sitting and inadequate ergonomic support <cite>1,3,4</cite>.  

**Key points for clinicians and occupational‑health teams**

| Factor | Why it matters | Practical implication |
|--------|----------------|-----------------------|
| **Sedentary time (>6‑8 h/day)** | Continuous lumbar loading, reduced disc nutrition, muscle de‑conditioning | Encourage scheduled micro‑breaks (1–2 min every 30 min) and standing or walking intervals |
| **Lack of lumbar support / poor chair design** | Increases lumbar flexion and shear forces | Provide adjustable chairs with lumbar roll or cushion; assess posture during a workstation audit |
| **Improper monitor/keyboard height** | Promotes forward head posture and thoracolumbar flexion | Adjust monitor at eye level, keep elbows at ~90°, forearms parallel to the floor |
| **Low trunk‑muscle endurance** | Reduces spinal stability, magnifies load on passive structures | Implement core‑strengthening or endurance programs (e.g., lumbar extension or “bird‑dog” exercises) as part of workplace wellness |

**Bottom line:** While low‑back pain in office workers is multifactorial, the primary driver is the combination of prolonged sitting and inadequate ergonomic support. Addressing these two elements—through workstation ergonomics, regular movement breaks, and basic core‑muscle conditioning—provides the most direct strategy for preventing and reducing back pain in this group.  

*Always verify individual risk factors and tailor interventions to each worker’s health status and job demands, and consider referral to a physiotherapist or occupational health specialist for persistent or severe symptoms.*`,
      createdAt: new Date(Date.now() - 90000).toISOString()
    },
    {
      id: "m10",
      role: 'assistant',
      content: "Standing desks can be a useful component of an ergonomic setup, as they facilitate regular posture changes. However, they are not a 'silver bullet.' Prolonged static standing can also lead to lower-back and leg fatigue. The key is **alternating** between sitting and standing throughout the day, coupled with short movement breaks.",
      createdAt: new Date(Date.now() - 10000).toISOString()
    }
  ],
  "chat-2": [
    {
      id: "m11",
      role: 'user',
      content: "Patient is on Lisinopril 10mg. Reporting dry cough. What's the best alternative?",
      createdAt: new Date(Date.now() - 200000).toISOString(),
      status: 'sent'
    },
    {
      id: "m12",
      role: 'assistant',
      content: "A persistent dry cough is a well-documented side effect of ACE inhibitors like Lisinopril, occurring in approximately 5-20% of patients due to bradykinin accumulation.\n**Recommendation**: Switch to an ARB (Angiotensin II Receptor Blocker). Losartan or Valsartan are standard clinical choices as they offer similar cardio-protective benefits without the cough side effect.\n**Typical Starting Dose**: Losartan 25mg or 50mg once daily.",
      createdAt: new Date(Date.now() - 180000).toISOString()
    }
  ],
  "chat-3": [
    {
      id: "m13",
      role: "user",
      content: "Summary of first-line meds for T2DM?",
      createdAt: new Date(Date.now() - 300000).toISOString(),
      status: "sent"
    },
    {
      id: "m14",
      role: "assistant",
      content: "Metformin remains the first-line pharmacological treatment for Type 2 Diabetes Mellitus, provided there are no contraindications such as severe renal impairment (eGFR < 30). It is favored for its efficacy in lowering HbA1c, low risk of hypoglycemia, and weight-neutral or weight-loss benefits.",
      createdAt: new Date(Date.now() - 250000).toISOString()
    }
  ],
  "chat-4": [
    {
      id: "m15",
      role: "user",
      content: "What should I tell the patient about wound infection signs?",
      createdAt: new Date(Date.now() - 400000).toISOString(),
      status: "sent"
    },
    {
      id: "m16",
      role: "assistant",
      content: "Patients should be instructed to monitor for the following signs of infection: increasing redness (erythema) spreading from the incision, increased warmth in the area, localized swelling, new or worsening pain, and any purulent drainage or foul odor. Systemic signs like fever or chills should also be reported immediately.",
      createdAt: new Date(Date.now() - 350000).toISOString()
    }
  ]
}
