import type { Consultation } from "../types"

const longTranscript = `Doctor: Good morning, John. How have you been feeling since our last visit regarding your respiratory symptoms?
Patient: Better, actually. The inhaler seems to be helping quite a bit, though I still get a bit winded if I climb more than two flights of stairs.
Doctor: That's a significant improvement. Let's listen to your lungs and see if we can hear any residual wheezing or congestion.

Doctor: Your breath sounds are much clearer today. I'm not hearing the same level of obstruction as last month. Are you still experiencing any night-time coughing?
Patient: Rarely now. Maybe once or twice a week, usually after a very long day at work when I'm tired.
Doctor: That's excellent news. We might be able to transition you to a lower maintenance dose if this trend continues for another month.

Doctor: Let's talk about your physical activity. You mentioned the stairs—are you still managing to get your daily walks in?
Patient: I'm trying. I do about 20 minutes most days. I feel much more confident now that the tightness in my chest has receded.
Doctor: Great. Consistency is key here. I'll document this progress and we'll keep the current regimen for four more weeks before reviewing again.`

export const mockConsultations: Consultation[] = [
  {
    id: "3",
    title: "Post-Op Orthopedic Review",
    patient: { id: "p1", name: "John Doe", age: 45, gender: "male" },
    date: "2024-02-10",
    description: "Scheduled follow-up after knee arthroscopy. Check wound healing and range of motion.",
    status: "draft",
    summary: `Patient is a 45-year-old male, 2 weeks status-post right knee arthroscopy for a complex medial meniscus tear. Today's visit is to evaluate wound healing and baseline range of motion (ROM). 

The surgical site was inspected: the three portals are clean, dry, and intact. There are no signs of erythema, warmth, or purulent discharge. Sutures were removed without complication. Active ROM was measured at 0–95 degrees, which is slightly ahead of the expected recovery curve. The patient reports a 4/10 pain level, mostly localized to the medial joint line during transition from sitting to standing.

The clinical plan remains focused on aggressive physical therapy (PT). Patient is currently attending PT 3 times weekly. We discussed the importance of avoiding high-impact activities for the next 4 weeks to allow for tissue consolidation. He is currently transitioning from crutches to a single-point cane as tolerated. 

Medication review: Patient has successfully tapered off hydrocodone and is now managing pain with Naproxen 500mg twice daily and scheduled icing. No signs of deep vein thrombosis (DVT) noted in calf. We will continue the current course and follow up in another 2 weeks for further ROM assessment and potential return-to-work clearance for his desk-based role. Patient demonstrated a clear understanding of the restrictions.`,
    transcript: "Doctor: Welcome back, John...",
    reports: [],
  },
  {
    id: "1",
    title: "Annual Checkup",
    patient: { id: "p1", name: "John Doe", age: 45, gender: "male" },
    date: "2024-01-15",
    description: "Routine annual health checkup including physical examination and lifestyle discussion.",
    duration: 45,
    status: "completed",
    summary: `Patient presented today for a comprehensive annual physical examination. He is a 45-year-old male with a significant family history of early-onset coronary artery disease (father had an MI at age 52). 

Subjective findings: The patient reports feeling "generally well" but mentions a noticeable dip in energy levels around 3:00 PM most days. He denies any chest pain, palpitations, or shortness of breath on exertion. Sleep quality is poor, averaging only 6 hours per night due to high stress levels at his software firm. Diet consists of moderate fast food. 

Objective findings: Vitals are stable, though BP is slightly elevated at 134/86 today. BMI is 28.5 (Overweight). Physical exam is largely unremarkable; heart is RRR without murmurs, and lungs are clear. No carotid bruits. 

Assessment & Plan:
1. Preventative Screen: Ordered a comprehensive metabolic panel, HbA1c, and a fasting lipid panel to assess 10-year ASCVD risk.
2. Fatigue: Likely secondary to sedentary lifestyle and poor sleep hygiene. Discussed the "30-minute walk" rule and blue light restriction after 9:00 PM.
3. Diet: Recommended transition to a Mediterranean-style diet to manage early hypertensive trends.
4. Follow-up: Patient to return in two weeks to review laboratory findings. If LDL is >130, we will discuss statin therapy given the family history. A baseline EKG was performed today and showed normal sinus rhythm.`,
    transcript: longTranscript,
    reports: [
      { id: "r1", title: "Lab Results", type: "Medical Report", createdAt: "2024-01-15" },
    ],
  },
  {
    id: "2",
    title: "Follow-up Consultation",
    patient: { id: "p2", name: "Jane Smith", age: 32, gender: "female" },
    date: "2024-01-18",
    description: "Post-treatment follow-up to review recovery progress and adjust treatment plan.",
    duration: 30,
    status: "in-progress",
    summary: `Patient is a 32-year-old female returning for a 1-month follow-up on her newly diagnosed moderate persistent asthma. Since starting the Symbicort maintenance inhaler, she reports a marked improvement in her daily activities.

Detailed review: Night-time awakenings have decreased from 4 times a week to less than once a week. She is currently using her Albuterol rescue inhaler only twice a week, usually during high-pollen days. Peak flow meter readings provided by the patient show an average of 420 L/min, up from her baseline of 360 L/min.

On examination: O2 saturation is 99% on room air. Lungs are clear with no audible expiratory wheeze. Heart rate is 72 bpm. No signs of oral thrush (patient is rinsing after inhaler use).

Clinical Decision: We will continue the current Symbicort 160/4.5 dose of two puffs twice daily for another 3 months. I have provided her with an updated Asthma Action Plan that details when to seek emergency care. We also discussed potential triggers in her home environment, specifically the new cat she adopted. She will monitor for any increased symptoms related to dander. If she remains stable at the 3-month mark, we will consider stepping down to a single-dose maintenance regimen. I encouraged her to continue her light jogging as her capacity has clearly improved.`,
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "4",
    title: "Acute Bronchitis Follow-up",
    patient: { id: "p1", name: "John Doe", age: 45, gender: "male" },
    date: "2023-11-05",
    description: "Check resolution of cough and chest congestion.",
    duration: 20,
    status: "completed",
    summary: `Patient is returning today for a follow-up regarding acute bronchitis diagnosed 10 days ago. He has successfully completed a 7-day course of Amoxicillin 500mg TID.

Patient reports that his productive cough has fully resolved. The yellow/green sputum reported at the initial visit is no longer present. He is no longer experiencing the low-grade fevers or the localized substernal chest soreness that accompanied the coughing fits. Baseline energy has returned, and he has resumed his normal work schedule.

Physical Exam: Temperature is 98.4°F. Pulmonary auscultation reveals clear lung fields bilaterally. There are no residual rales, rhonchi, or wheezes in the lower lobes. Peak flow is at 100% of his normal baseline. No lymphadenopathy noted in the cervical or axillary nodes.

Assessment: Resolved acute bronchitis. No further antibiotic therapy is required. I have advised the patient that a dry "post-viral" cough can occasionally linger for another week and is not a cause for concern unless it becomes productive again. He has been cleared to resume full exercise. I recommended he receive his annual flu shot before the end of the month to prevent secondary infections this season.`,
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "5",
    title: "Initial Specialist Referral",
    patient: { id: "p1", name: "John Doe", age: 45, gender: "male" },
    date: "2023-08-20",
    description: "Baseline assessment for new patient. Reviewing chronic lower back pain and history of hypertension.",
    duration: 60,
    status: "completed",
    summary: `Initial consultation for a new patient presenting with chronic lower back pain localized to the L4-L5 region. The pain has been persistent for approximately 6 months, described as a dull, aching sensation that worsens after prolonged sitting at his desk. He denies any radiation to the lower extremities, numbness, or "pins and needles" sensations. Bladder and bowel function are normal.

Objective: Straight leg raise test is negative bilaterally. Lower extremity strength is 5/5 in all muscle groups. Sensation is intact to light touch in all dermatomes. Reflexes are 2+ and symmetric. Some mild paraspinal muscle tenderness is noted.

Assessment: Chronic mechanical low back pain without radiculopathy. Hypertension, stable.

Plan:
1. Physical Therapy: Referral placed for 8 weeks of core strengthening and lumbar stabilization.
2. Imaging: Not indicated at this time given the lack of red flags or radicular symptoms.
3. Medication: Discussed the transition from daily Ibuprofen to "as needed" use to protect renal function. 
4. Work ergonomics: Advised on the use of a standing desk and frequent postural breaks.
5. Hypertension: Continue Lisinopril 10mg. BP today was excellent at 126/80. We will continue this regimen and re-evaluate the back pain progress in 2 months.`,
    transcript: longTranscript,
    reports: [],
  },
]
