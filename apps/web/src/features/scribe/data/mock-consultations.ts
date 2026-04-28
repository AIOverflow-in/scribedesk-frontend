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
    summary: `
### SUBJECTIVE
Patient is a 45-year-old male, 2 weeks status-post right knee arthroscopy for a complex medial meniscus tear. Today's visit is to evaluate wound healing and baseline range of motion (ROM). 

### OBJECTIVE
The surgical site was inspected: the three portals are clean, dry, and intact. There are no signs of erythema, warmth, or purulent discharge. Sutures were removed without complication. Active ROM was measured at 0–95 degrees, which is slightly ahead of the expected recovery curve. The patient reports a 4/10 pain level, mostly localized to the medial joint line during transition from sitting to standing.

### ASSESSMENT & PLAN
The clinical plan remains focused on aggressive physical therapy (PT). Patient is currently attending PT 3 times weekly. We discussed the importance of avoiding high-impact activities for the next 4 weeks to allow for tissue consolidation. He is currently transitioning from crutches to a single-point cane as tolerated. 

### MEDICATIONS
Patient has successfully tapered off hydrocodone and is now managing pain with Naproxen 500mg twice daily and scheduled icing. No signs of deep vein thrombosis (DVT) noted in calf. 

### FOLLOW-UP
We will continue the current course and follow up in another 2 weeks for further ROM assessment and potential return-to-work clearance.

### DETAILED REHABILITATION PLAN
- **Phase 1 (Weeks 1-2):**
  - Focus on edema control and static quadriceps firing.
  - Active-assisted ROM goal: 0-90 degrees.
  - Weight bearing as tolerated (WBAT) with crutches.
- **Phase 2 (Weeks 3-6):**
  - Progress to full weight bearing without assistive devices.
  - Initiate closed-chain exercises (mini-squats, wall sits).
  - Target ROM: 0-120 degrees.
- **Phase 3 (Weeks 7-12):**
  - Proprioceptive training (single-leg balance).
  - Introduction of low-impact cardiovascular training (stationary bike).
  - Progression to resistance training.

### CLINICAL MILESTONES
1. **Wound Closure:** Completed today. Portals are epithelialized.
2. **Pain Management:** Transitioned from opioids to NSAIDs successfully.
3. **Functional Goal:** Return to light driving expected by Week 3.
4. **Long-term Goal:** Return to recreational jogging at Month 6, pending clearance.

### PATIENT EDUCATION
- Importance of consistent icing (20 mins, 4-5 times daily).
- Warning signs: Increased calf pain, shortness of breath, or excessive fever.
- Ergonomic workspace adjustments for remote work.
- Compliance with physical therapy home exercise program (HEP).
    `.trim(),
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
    summary: `
### SUBJECTIVE
Patient is a 45-year-old male presenting for an annual physical examination. Significant family history of early-onset coronary artery disease (father had an MI at age 52). Reports noticeable dip in energy levels around 3:00 PM. Sleep quality is poor (6 hours/night).

### OBJECTIVE
Vitals are stable, though BP is slightly elevated at 134/86. BMI is 28.5 (Overweight). Heart is RRR without murmurs, and lungs are clear.

### ASSESSMENT & PLAN
1. **Preventative Screen:** Ordered metabolic panel, HbA1c, and fasting lipid panel.
2. **Fatigue:** Likely secondary to sedentary lifestyle and poor sleep hygiene.
3. **Diet:** Recommended transition to a Mediterranean-style diet.

### FOLLOW-UP
Patient to return in two weeks to review laboratory findings.
    `.trim(),
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
    summary: `
### SUBJECTIVE
Patient is a 32-year-old female returning for a 1-month follow-up on her newly diagnosed moderate persistent asthma. Reports marked improvement in daily activities. Night-time awakenings have decreased to less than once a week.

### OBJECTIVE
O2 saturation is 99% on room air. Lungs are clear with no audible expiratory wheeze. Heart rate is 72 bpm. Peak flow meter: 420 L/min (baseline 360).

### ASSESSMENT & PLAN
- **Action:** Continue current Symbicort 160/4.5 (two puffs BID) for 3 months.
- **Education:** Provided updated Asthma Action Plan. Discussed triggers (new cat).
- **Goal:** Consider step-down to single-dose maintenance if stable at next visit.
    `.trim(),
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
    summary: `
### SUBJECTIVE
Returning for follow-up regarding acute bronchitis. Productive cough has fully resolved. Yellow/green sputum is no longer present. Low-grade fevers have ceased. Baseline energy has returned.

### OBJECTIVE
Temperature is 98.4°F. Pulmonary auscultation reveals clear lung fields bilaterally. No residual rales, rhonchi, or wheezes.

### ASSESSMENT & PLAN
- **Status:** Resolved acute bronchitis. No further antibiotics required.
- **Advice:** Dry "post-viral" cough may linger.
- **Prevention:** Recommended annual flu shot.
    `.trim(),
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
    summary: `
### SUBJECTIVE
New patient presenting with chronic lower back pain localized to L4-L5 region (6 months). Pain is dull, aching, worsens with sitting. No radiation or radicular symptoms.

### OBJECTIVE
Straight leg raise test negative bilaterally. Lower extremity strength is 5/5. Sensation intact. Reflexes 2+ and symmetric. Mild paraspinal tenderness.

### ASSESSMENT & PLAN
1. **Diagnosis:** Chronic mechanical low back pain without radiculopathy.
2. **Hypertension:** Stable on Lisinopril 10mg (BP 126/80).
3. **Plan:** Physical Therapy referral (8 weeks), Ibuprofen as needed, Ergonomic standing desk.
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "6",
    title: "Cardiology Consultation",
    patient: { id: "p1", name: "John Doe", age: 45, gender: "male" },
    date: "2023-06-12",
    description: "Heart health evaluation following elevated blood pressure readings.",
    duration: 40,
    status: "completed",
    summary: `
### SUBJECTIVE
45-year-old male referred by PCP for evaluation of borderline hypertension and family history of early CAD. Patient reports occasional palpitations with caffeine intake but denies chest pain or syncope.

### OBJECTIVE
BP 138/88. HR 76 regular. Cardiac exam reveals S1/S2 normal, no murmurs, rubs, or gallops. EKG shows normal sinus rhythm. BMI 28.5.

### ASSESSMENT & PLAN
- **Diagnosis:** Essential hypertension, stage 1. Low cardiovascular risk.
- **Recommendation:** Lifestyle modifications (DASH diet, exercise 150min/week).
- **Follow-up:** Return in 6 months for BP recheck.
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "7",
    title: "Dermatology Skin Check",
    patient: { id: "p1", name: "John Doe", age: 45, gender: "male" },
    date: "2023-04-08",
    description: "Annual skin examination and removal of suspicious moles.",
    duration: 25,
    status: "completed",
    summary: `
### SUBJECTIVE
Routine skin exam. Patient reports a new slightly raised lesion on his left forearm that has grown over 6 months.

### OBJECTIVE
Examination revealed 4mm flesh-colored papule left forearm, consistent with intradermal nevus. Two additional solar lentigines on dorsal hands. No melanoma suspicion.

### ASSESSMENT & PLAN
- **Nevus:** Benign appearance, no biopsy needed. Photograph for documentation.
- **Sun protection:** Daily SPF 30 recommended.
- **Next skin exam:** 12 months.
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "8",
    title: "Gastroenterology Consult",
    patient: { id: "p1", name: "John Doe", age: 44, gender: "male" },
    date: "2023-01-22",
    description: "Evaluation of recurring acid reflux and bloating symptoms.",
    duration: 35,
    status: "completed",
    summary: `
### SUBJECTIVE
44-year-old male with 3-month history of heartburn, regurgitation, and post-prandial bloating. Symptoms worse after coffee and fatty foods. No weight loss or dysphagia.

### OBJECTIVE
Abdomen soft, non-tender. No organomegaly. BMI 27.8.

### ASSESSMENT & PLAN
- **Diagnosis:** GERD with functional dyspepsia.
- **Treatment:** PPI (Omeprazole 20mg daily) for 8 weeks, food diary.
- **Lifestyle:** Elevate head of bed, avoid late meals.
- **Follow-up:** If symptoms persist, consider endoscopy.
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "9",
    title: "Pulmonology Visit",
    patient: { id: "p1", name: "John Doe", age: 44, gender: "male" },
    date: "2022-11-15",
    description: "Follow-up for mild asthma diagnosis and inhaler adjustment.",
    duration: 30,
    status: "completed",
    summary: `
### SUBJECTIVE
Patient reports improved breathing since starting Flovent inhaler twice daily. Exercise-induced shortness of breath has decreased. No nighttime symptoms.

### OBJECTIVE
O2 sat 98% on room air. Lungs clear bilaterally. FEV1 92% predicted. Good airflow.

### ASSESSMENT & PLAN
- Continue Flovent 110mcg 2 puffs BID.
- Albuterol rescue inhaler as needed.
- Reassess in 3 months.
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "10",
    title: "Ophthalmology Exam",
    patient: { id: "p1", name: "John Doe", age: 44, gender: "male" },
    date: "2022-09-03",
    description: "Routine eye examination with new prescription for reading glasses.",
    duration: 20,
    status: "completed",
    summary: `
### SUBJECTIVE
Annual eye exam. Patient noticing difficulty focusing on close text, especially in low light. No visual disturbances, flashes, or floaters.

### OBJECTIVE
Visual acuity 20/25 OD, 20/20 OS. Intraocular pressure normal. Fundoscopic exam shows healthy optic discs. Cataracts absent.

### ASSESSMENT & PLAN
- **Prescription:** Readers +1.25 for close work.
- **Advice:** Annual exam continued.
- **Follow-up:** 12 months.
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "11",
    title: "ENT Consultation",
    patient: { id: "p1", name: "John Doe", age: 43, gender: "male" },
    date: "2022-06-18",
    description: "Evaluation of chronic seasonal allergies and nasal congestion.",
    duration: 30,
    status: "completed",
    summary: `
### SUBJECTIVE
Patient reports 2-year history of seasonal allergies causing nasal congestion, sneezing, and itchy eyes. Over-the-counter antihistamines provide partial relief.

### OBJECTIVE
Nasal mucosa slightly edematous but pink. No polyps. Sinuses non-tender to palpation. TMs clear bilaterally.

### ASSESSMENT & PLAN
- **Diagnosis:** Allergic rhinitis, moderate.
- **Treatment:** Fluticasone nasal spray daily, continue cetirizine as needed.
- **Allergen avoidance counseling provided.**
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
  {
    id: "12",
    title: "Initial Physical",
    patient: { id: "p1", name: "John Doe", age: 43, gender: "male" },
    date: "2022-03-10",
    description: "New patient comprehensive physical examination.",
    duration: 60,
    status: "completed",
    summary: `
### SUBJECTIVE
43-year-old male establishing care. No acute complaints. Past medical history significant for childhood asthma (resolved). Family history notable for father with CAD at 52.

### OBJECTIVE
Vitals: BP 128/82, HR 68, BMI 26.2. General: Well-appearing male. Heart RRR, lungs clear. Abdomen soft, non-tender.

### ASSESSMENT & PLAN
- **Overall:** Healthy adult male, establish care.
- **Preventive:** Updated vaccines, discussed colonoscopy at 50.
- **Labs:** CBC, metabolic panel, lipid panel ordered.
- **Follow-up:** 12 months for routine physical.
    `.trim(),
    transcript: longTranscript,
    reports: [],
  },
]
