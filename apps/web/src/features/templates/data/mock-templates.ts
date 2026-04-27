import type { Template } from "../types"

export const mockTemplates: Template[] = [
  {
    id: "temp-1",
    title: "Standard SOAP Note",
    description: "Universal template for clinical encounters including Subjective, Objective, Assessment, and Plan.",
    category: "Notes",
    updatedAt: new Date().toISOString(),
    content: `# Clinical Note: SOAP

### Subjective
* **Chief Complaint:** 
* **History of Present Illness:** 
* **Review of Systems:** 

### Objective
* **Vital Signs:** 
* **Physical Examination:** 

### Assessment
1. 
2. 

### Plan
* **Diagnostics:** 
* **Therapeutics:** 
* **Follow-up:** `
  },
  {
    id: "temp-2",
    title: "Referral Letter",
    description: "Formal referral to a specialist with patient history and clinical reasoning.",
    category: "Letters",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    content: `# Referral Letter

**Date:** ${new Date().toLocaleDateString()}
**To:** Dr. 
**Specialty:** 

**Patient:** 
**DOB:** 

Dear Colleague,

I am referring this patient for further evaluation regarding...

### Clinical History
* 

### Current Medications
* 

### Clinical Question
* 

Thank you for your collaborative care.

Regards,`
  },
  {
    id: "temp-3",
    title: "Discharge Summary",
    description: "Comprehensive summary of hospital stay, treatments, and post-discharge instructions.",
    category: "Reports",
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    content: `# Discharge Summary

**Admission Date:** 
**Discharge Date:** 

### Admission Reason
* 

### Hospital Course
* 

### Procedures Performed
* 

### Discharge Medications
1. 
2. 

### Follow-up Instructions
* `
  }
]
