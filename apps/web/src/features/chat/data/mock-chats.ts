import type { ChatThread, ChatMessage } from "../types"

export const mockThreads: ChatThread[] = [
  {
    id: "chat-1",
    title: "Post-Op Knee Recovery Logic",
    lastMessageSnippet: "Watch for fever > 101°F and increasing localized warmth.",
    updatedAt: new Date().toISOString(),
    context: { type: 'consultation', id: 'session-1' }
  },
  {
    id: "chat-2",
    title: "ACE Inhibitor Side Effects",
    lastMessageSnippet: "The patient is reporting a persistent dry cough.",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "chat-3",
    title: "Referral Coordination: Cardiology",
    lastMessageSnippet: "I have prepared the draft referral for Dr. Aris.",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
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
      id: "m3",
      role: 'user',
      content: "Does this protocol change if the patient has a history of venous thromboembolism (VTE)?",
      createdAt: new Date(Date.now() - 80000).toISOString(),
      status: 'sent'
    },
    {
      id: "m4",
      role: 'assistant',
      content: `Yes, for patients with a history of VTE, the surveillance for DVT must be significantly more aggressive. 

You should specifically monitor for these additional signs:
*   **Localized Calf Tenderness**: Pain along the course of the deep venous system.
*   **Pitting Edema**: New or worsening swelling that doesn't resolve with elevation.
*   **Discoloration**: Erythema or cyanosis of the lower extremity.

**Clinical Recommendation**: Ensure the patient is strictly adhering to their mechanical prophylaxis (compression stockings/SCDs) and pharmacological anticoagulation as prescribed.`,
      createdAt: new Date(Date.now() - 70000).toISOString()
    },
    {
      id: "m5",
      role: 'user',
      content: "Should I schedule a 1-week follow-up for wound check?",
      createdAt: new Date(Date.now() - 60000).toISOString(),
      status: 'sent'
    },
    {
      id: "m6",
      role: 'assistant',
      content: "Standard arthroplasty protocols typically recommend a wound check between days 7-14. Given the VTE history, a 1-week visit is highly recommended to assess both incision healing and to perform a focused lower-extremity vascular screening. I have added this recommendation to the pending tasks list for this patient.",
      createdAt: new Date(Date.now() - 50000).toISOString()
    },
    {
      id: "m7",
      role: 'user',
      content: "Thanks. Please draft a quick patient-friendly summary of the VTE risks.",
      createdAt: new Date(Date.now() - 40000).toISOString(),
      status: 'sent'
    },
    {
      id: "m8",
      role: 'assistant',
      content: `**Understanding Blood Clot Risks (VTE)**

Because of your medical history, we take extra precautions to prevent blood clots. To stay safe:
1. **Move often**: Perform ankle pumps and walk as much as tolerated.
2. **Wear stockings**: Use your compression stockings as directed.
3. **Take medication**: Do not skip any doses of your prescribed blood thinner.

**Watch for**: Sudden leg swelling, sharp chest pain, or shortness of breath. Call us immediately if you experience these.`,
      createdAt: new Date(Date.now() - 30000).toISOString()
    },
    {
      id: "m9",
      role: 'user',
      content: "Final question: what about standing desks? Are they effective?",
      createdAt: new Date(Date.now() - 20000).toISOString(),
      status: 'sent'
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
  ]
}
