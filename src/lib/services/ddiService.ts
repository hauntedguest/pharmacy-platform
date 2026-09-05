export interface InteractionAnalysisResult {
  severity: "High" | "Moderate" | "Minor" | "Safe";
  title: string;
  drugsInvolved: string[];
  mechanism: string;
  clinicalAdvice: string;
  foodAdvisory?: string;
}

const CLINICAL_INTERACTIONS: InteractionAnalysisResult[] = [
  {
    severity: "High",
    title: "NSAID & ARB Antihypertensive Contraindication",
    drugsInvolved: ["Telmisartan", "Diclofenac"],
    mechanism:
      "Concomitant use of NSAIDs with Angiotensin II Receptor Blockers may attenuate the antihypertensive effect of Telmisartan and significantly increase the risk of acute renal deterioration and hyperkalemia.",
    clinicalAdvice:
      "Avoid frequent oral NSAIDs. If pain relief is necessary, use MediCare Plus Paracetamol 650mg or consult our clinical pharmacist for topical alternatives.",
    foodAdvisory: "Avoid high-potassium salt substitutes while on Telmisartan.",
  },
  {
    severity: "Moderate",
    title: "Proton Pump Inhibitor & Absorption Modification",
    drugsInvolved: ["Pantoprazole", "Vitamin D3"],
    mechanism:
      "Prolonged gastric acid suppression by Pantoprazole may mildly reduce the intestinal absorption of dietary calcium and fat-soluble vitamins.",
    clinicalAdvice:
      "Take Pantoprazole in the morning 30 minutes before breakfast, and schedule MediCare Plus D3 Max with a fat-rich meal (lunch or dinner) with an 8-hour separation.",
    foodAdvisory: "Take Vitamin D3 with whole milk, curd, or nuts for optimal micellar absorption.",
  },
  {
    severity: "Moderate",
    title: "High-Potency Omega-3 & Anti-Platelet Synergy",
    drugsInvolved: ["Omega-3", "Aspirin"],
    mechanism:
      "High doses of EPA/DHA (over 1000mg/day) possess mild anti-platelet aggregation properties which can have additive bleeding effects with antiplatelet drugs.",
    clinicalAdvice:
      "Maintain EPA/DHA dosage under clinical supervision and inform your surgeon prior to any elective dental or surgical procedures.",
    foodAdvisory: "Take with meals to eliminate fishy reflux and optimize lipid absorption.",
  },
  {
    severity: "Minor",
    title: "Probiotic Timing & Gastric Acid Sensitivity",
    drugsInvolved: ["FloraMax Probiotic", "Pantoprazole"],
    mechanism:
      "Although FloraMax uses delayed-release capsules, administering probiotics during peak PPI acid-suppression windows improves bacterial colonization in the small intestine.",
    clinicalAdvice:
      "Safe and synergistic combination. Take Probiotics 20 minutes before breakfast with a lukewarm glass of water.",
  },
  {
    severity: "Safe",
    title: "No Adverse Pharmacological Interaction Detected",
    drugsInvolved: ["Paracetamol", "Vitamin C"],
    mechanism:
      "No pharmacokinetic or pharmacodynamic antagonism. Vitamin C supports immune synthesis while Paracetamol modulates central prostaglandin thermoregulation.",
    clinicalAdvice:
      "Safe for concurrent administration according to recommended dosage guidelines.",
  },
];

export const ddiService = {
  analyzeInteractions(medications: string[]): InteractionAnalysisResult[] {
    if (medications.length < 2) {
      return [
        {
          severity: "Safe",
          title: "Single Formulation Baseline",
          drugsInvolved: medications,
          mechanism: "No concurrent medication interactions detected. Single formulation within therapeutic range.",
          clinicalAdvice: "Follow the dosage instructions printed on the blister pack.",
        },
      ];
    }

    const matches: InteractionAnalysisResult[] = [];

    // Evaluate pair-wise matching against clinical knowledge base
    for (const rule of CLINICAL_INTERACTIONS) {
      const matchCount = rule.drugsInvolved.filter((drugKeyword) =>
        medications.some((userMed) => userMed.toLowerCase().includes(drugKeyword.toLowerCase()))
      ).length;

      if (matchCount >= rule.drugsInvolved.length) {
        matches.push(rule);
      }
    }

    if (matches.length === 0) {
      return [
        {
          severity: "Safe",
          title: "No Adverse Interaction Detected",
          drugsInvolved: medications,
          mechanism: "No documented pharmacokinetic or pharmacodynamic contraindications between the selected proprietary MediCare Plus formulations.",
          clinicalAdvice: "Safe for concurrent usage. Maintain a 30-minute window between supplements and prescription medications.",
        },
      ];
    }

    return matches;
  },
};
