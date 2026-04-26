import type { Report } from "../types"

export const mockReports: Record<string, Report> = {
  "soap-note-1": {
    id: "r1",
    title: "SOAP Note - Annual Checkup",
    type: "soap-note",
    createdAt: "2024-01-15T10:30:00Z",
    content: `
### SUBJECTIVE
Patient is a 45-year-old male presenting for an annual physical examination. He reports feeling "generally well" but mentions occasional fatigue over the past 3 months, particularly in the late afternoons. No history of chest pain, shortness of breath, or palpitations. Sleep is approximately 6 hours per night. Diet consists of "moderate fast food" due to work schedule. Exercise is minimal.

### OBJECTIVE
- **Vitals:** BP 132/84, HR 72, Temp 98.6°F, SpO2 98% on room air.
- **General:** Well-developed, well-nourished male in no acute distress. Alert and oriented x3.
- **HEENT:** Normocephalic, atraumatic. Pupils equal, round, and reactive to light. Oropharynx clear.
- **Neck:** Supple. No lymphadenopathy or thyromegaly.
- **Cardiovascular:** Regular rate and rhythm. S1, S2 normal. No murmurs, rubs, or gallops.
- **Respiratory:** Lungs clear to auscultation bilaterally. No wheezes, rales, or rhonchi.
- **Abdomen:** Soft, non-tender, non-distended. Bowel sounds present in all four quadrants.
- **Musculoskeletal:** Normal range of motion in all major joints. No edema.

### ASSESSMENT
1. **Annual Physical Exam:** Overall healthy male with slightly elevated blood pressure.
2. **Fatigue:** Likely secondary to poor sleep hygiene and sedentary lifestyle.
3. **Elevated Blood Pressure:** BP 132/84. Does not meet criteria for hypertension yet but requires monitoring.

### PLAN
1. **Labs:** Ordered CBC, CMP, Lipid Panel, TSH, and HbA1c to rule out anemia or thyroid issues.
2. **Lifestyle:** Discussed improving sleep hygiene (aiming for 7-8 hours) and increasing physical activity (walking 30 mins, 5 days/week).
3. **Follow-up:** Schedule follow-up in 2 weeks to review lab results and re-check blood pressure.
    `.trim()
  },
  
  "referral-letter-1": {
    id: "r2",
    title: "Referral to Cardiology",
    type: "referral-letter",
    createdAt: "2024-01-15T11:00:00Z",
    content: `
**Date:** January 15, 2024
**To:** Dr. Sarah Chen, Department of Cardiology
**From:** Dr. Alexander Care
**Subject:** Referral for John Doe (DOB: 05/12/1979)

Dear Dr. Chen,

I am writing to refer Mr. John Doe, a 45-year-old male, for a cardiovascular evaluation. Mr. Doe presented today for his annual checkup, during which I noted a slightly elevated blood pressure of 132/84. 

While he is currently asymptomatic regarding chest pain or palpitations, he has a family history of early-onset coronary artery disease (father had MI at age 52). Given this family history and his reported occasional fatigue, I believe a baseline EKG and specialized cardiac assessment are warranted.

Current medications: None.
Allergies: NKDA.

I have ordered a basic metabolic panel and lipid profile, the results of which will be forwarded to your office as soon as they are available.

Thank you for seeing Mr. Doe in consultation. Please feel free to contact my office if you require any further information.

Sincerely,

Dr. Alexander Care
Acme Medical Center
    `.trim()
  },
  "soap-long": {
    id: "r3",
    title: "Detailed Clinical Note - Extended",
    type: "soap-note",
    createdAt: "2024-01-20T09:00:00Z",
    content: `
### SUBJECTIVE
Patient is a 68-year-old female with a complex history of Type 2 Diabetes, Hypertension, and Osteoarthritis. She presents today for a comprehensive review of her chronic conditions. 

She reports that her home glucose readings have been fluctuating between 140 and 190 mg/dL. She admits to "slipping" on her diet during the recent holidays. She also mentions increased stiffness in her knees, especially in the morning, which lasts about 45 minutes.

### OBJECTIVE
| Parameter | Value | Reference |
| :--- | :--- | :--- |
| Blood Pressure | 145/88 mmHg | < 130/80 |
| Heart Rate | 78 bpm | 60-100 |
| Temperature | 98.2 °F | 97.8-99.1 |
| Weight | 185 lbs | -- |

### PHYSICAL EXAM
- Cardiovascular: RRR, no murmurs. 
- Respiratory: Clear to auscultation bilaterally.
- Musculoskeletal: Bilateral crepitus noted in knee joints. No acute swelling. Decreased ROM in right knee.
- Neurological: Decreased sensation to monofilament testing at the base of the great toe bilaterally.
- Integumentary: Skin is intact. No diabetic ulcers noted on feet. Pedal pulses 2+ bilaterally.

### DETAILED REVIEW OF SYSTEMS
- Constitutional: Reports mild fatigue. No fevers or chills.
- Eyes: Last eye exam was 8 months ago. Reports no new vision changes.
- Respiratory: No cough or wheezing.
- Cardiovascular: No chest pain or edema.
- Gastrointestinal: Occasional acid reflux after large meals.
- Genitourinary: Increased frequency of urination, consistent with elevated glucose levels.
- Endocrine: Polydipsia reported. No heat/cold intolerance.

### ASSESSMENT & PLAN
1. **Type 2 Diabetes (Poorly Controlled):** 
   - HbA1c today is 8.2% (up from 7.4%).
   - Plan: Increase Metformin to 1000mg BID. Referred to diabetic educator for nutritional counseling.
   - Patient education provided on glucose monitoring and carb counting.

2. **Hypertension:**
   - BP is elevated today at 145/88.
   - Plan: Continue current Lisinopril. Patient to keep a home BP log and return in 2 weeks.
   - Discussed sodium restriction.

3. **Osteoarthritis (Knees):**
   - Symptoms consistent with progressive OA.
   - Plan: Recommended OTC Acetaminophen for pain. Discussed low-impact exercise like swimming.
   - Physical Therapy referral placed for knee strengthening.

4. **Hyperlipidemia:**
   - Review of last labs shows LDL 135.
   - Plan: Continue Atorvastatin 20mg. Re-check lipid panel in 3 months.

5. **Preventative Care:**
   - Patient is due for a Dexa Scan. Referral placed.
   - Flu vaccine administered today.
   - Mammogram scheduled for next month.

### CHRONIC MEDICATION LIST
- Metformin 1000mg BID
- Lisinopril 20mg daily
- Atorvastatin 20mg daily
- Multivitamin daily
- Glucosamine/Chondroitin daily

### FOLLOW-UP
Patient to return in 2 weeks for BP check and review of home glucose logs. Laboratory tests (Lipid panel, Microalbuminuria) were ordered today.

### CLINICAL COUNSELING
Comprehensive discussion regarding the importance of consistent medication adherence and the long-term risks of uncontrolled blood sugar, including neuropathy and retinopathy. Patient demonstrated understanding of the plan.

### PHARMACY INFO
- Local CVS (Main St, Plaza Center)
- Metformin 1000mg #60 (1 Refill)
- Lisinopril 20mg #30 (No Refill)
- Atorvastatin 20mg #30 (2 Refills)

### ADMINISTRATIVE NOTES
Prior authorization for Dexa scan initiated. Coordination of care with patient's cardiologist Dr. Chen regarding blood pressure management. 

### NURSE NOTES
Patient arrived 10 minutes early. Assisted with monofilament test preparation. Patient received educational brochures on foot care for diabetics.
    `.trim()
  }
}
