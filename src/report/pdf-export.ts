import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ResultEntry, Handedness } from "@/lib/types";
import type { AggregatedDiagnoses } from "@/engine/diagnosis-aggregator";
import { resolvePattern, matchExercises, buildTodaysProgram } from "@/exercise/matcher";
import { predictSwingFaults } from "@/tpi/sfma-to-tpi";
import { resolveLeadTrail } from "@/lib/types";

const DARK = "#2c3e50";
const RED = "#c0392b";
const GREEN = "#16a085";
const BLUE = "#2980b9";

function header(doc: jsPDF, text: string, bgColor: string, y: number): number {
  doc.setFillColor(bgColor);
  doc.roundedRect(14, y, 182, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#ffffff");
  doc.text(text, 105, y + 7, { align: "center" });
  return y + 14;
}

function subheader(doc: jsPDF, text: string, y: number): number {
  doc.setFillColor("#e2e8f0");
  doc.roundedRect(14, y, 182, 8, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#334155");
  doc.text(text, 20, y + 5.5);
  return y + 11;
}

function checkPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage();
    return 15;
  }
  return y;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function scoreFillColor(score: string): string {
  if (score === "FN") return "#10b981";
  if (score.includes("P")) return "#ef4444";
  return "#f59e0b";
}

export function exportClinicalAuditPDF(
  client: string,
  agg: AggregatedDiagnoses,
  results: ResultEntry[]
) {
  const doc = new jsPDF();
  const date = formatDate();

  let y = header(doc, "SFMA CLINICAL MOVEMENT AUDIT", DARK, 15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#334155");
  doc.text(`PATIENT: ${client}`, 14, y + 3);
  doc.text(`DATE: ${date}`, 196, y + 3, { align: "right" });
  y += 10;

  y = header(doc, "PART I: GLOBAL MOVEMENT STATUS (TOP TIER)", "#475569", y);

  const ttRows = agg.topTier.map((r) => [r.pattern, r.score]);
  autoTable(doc, {
    startY: y,
    head: [["Movement Pattern", "Score"]],
    body: ttRows,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: "#475569", textColor: "#ffffff", fontStyle: "bold" },
    columnStyles: { 1: { halign: "center", cellWidth: 20 } },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 1) {
        const score = data.cell.raw as string;
        data.cell.styles.fillColor = scoreFillColor(score);
        data.cell.styles.textColor = "#ffffff";
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  y = checkPage(doc, y, 20);

  y = header(doc, "PART II: CLINICAL BREAKOUT CHAINS", "#475569", y);

  for (const [pattern, entries] of Array.from(agg.breakouts.entries())) {
    y = checkPage(doc, y, 20);
    y = subheader(doc, `${pattern.toUpperCase()} SEQUENCE`, y);

    const boRows = entries.map((r) => [
      `  > ${r.test}`,
      r.score,
      r.diag || "",
    ]);
    autoTable(doc, {
      startY: y,
      body: boRows,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: "italic" },
        1: { cellWidth: 15, halign: "center", fontStyle: "bold" },
        2: { fontStyle: "bold" },
      },
      didParseCell(data) {
        if (data.column.index === 1) {
          const score = data.cell.raw as string;
          data.cell.styles.textColor = score === "FN" ? "#10b981" : score.includes("P") ? "#ef4444" : "#f59e0b";
        }
        if (data.column.index === 2) {
          const diag = data.cell.raw as string;
          data.cell.styles.textColor = diag.includes("MD") ? "#ea580c" : "#2563eb";
        }
      },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
  }

  if (agg.breakouts.size === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor("#94a3b8");
    doc.text("All top-tier tests scored FN -- no breakout chains required.", 105, y + 4, { align: "center" });
  }

  doc.save(`SFMA_Clinical_Audit_${client.replace(/\s+/g, "_")}.pdf`);
}

export function exportProgramPDF(
  client: string,
  agg: AggregatedDiagnoses,
) {
  const doc = new jsPDF();
  const date = formatDate();

  let y = header(doc, "IN-HOUSE CLINICAL PROGRAM", GREEN, 15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#334155");
  doc.text(`PATIENT: ${client}`, 14, y + 3);
  doc.text(`DATE: ${date}`, 196, y + 3, { align: "right" });
  y += 10;

  if (agg.terminalDiagnoses.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor("#94a3b8");
    doc.text("No terminal diagnoses -- no corrective exercises needed.", 105, y + 4, { align: "center" });
    doc.save(`SFMA_Program_${client.replace(/\s+/g, "_")}.pdf`);
    return;
  }

  y = header(doc, "TODAY'S PROGRAM (PRIORITIZED)", "#334155", y);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor("#94a3b8");
  doc.text("MD (mobility) addressed first, then SMCD (motor control). Max 2 exercises per category.", 105, y + 2, { align: "center" });
  y += 6;

  const todaysProgram = buildTodaysProgram(agg.terminalDiagnoses);

  if (todaysProgram.length > 0) {
    const todayRows = todaysProgram.map((rx, i) => [
      `${i + 1}.`,
      rx.exercise.name + (rx.side ? ` [${rx.side}]` : ""),
      rx.exercise.category,
      `${rx.sets} x ${rx.reps}`,
      rx.exercise.dysfunctionType,
    ]);
    autoTable(doc, {
      startY: y,
      head: [["#", "Exercise", "Category", "Prescription", "Type"]],
      body: todayRows,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
      headStyles: { fillColor: GREEN, textColor: "#ffffff", fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 50, fontStyle: "bold" },
        2: { cellWidth: 35 },
        3: { cellWidth: 40 },
        4: { cellWidth: 12, halign: "center", fontStyle: "bold" },
      },
      didParseCell(data) {
        if (data.section === "body" && data.column.index === 4) {
          const t = data.cell.raw as string;
          data.cell.styles.textColor = t === "MD" ? "#ea580c" : "#2563eb";
        }
      },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;

    y = checkPage(doc, y, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#64748b");
    for (const rx of todaysProgram) {
      y = checkPage(doc, y, 8);
      doc.text(`- ${rx.exercise.name}: ${rx.forDiagnosis}`, 16, y);
      y += 4;
    }
    y += 4;
  }

  doc.addPage();
  y = 15;
  y = header(doc, "FULL EXERCISE LIBRARY (BY DIAGNOSIS)", "#475569", y);

  for (const r of agg.terminalDiagnoses) {
    y = checkPage(doc, y, 30);
    const pattern = resolvePattern(r.pattern);
    const matched = matchExercises([r], pattern);
    if (matched.length === 0) continue;

    let side = "";
    if (r.test.endsWith(" L")) side = " [LEFT]";
    else if (r.test.endsWith(" R")) side = " [RIGHT]";

    y = subheader(doc, `${r.diag || "Unknown"}${side}`, y);

    const exRows = matched.slice(0, 5).map((e) => [e.name, e.category, e.description]);
    autoTable(doc, {
      startY: y,
      head: [["Exercise", "Category", "Description"]],
      body: exRows,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
      headStyles: { fillColor: "#475569", textColor: "#ffffff", fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: "bold" },
        1: { cellWidth: 30 },
        2: { cellWidth: "auto" },
      },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  doc.save(`SFMA_Program_${client.replace(/\s+/g, "_")}.pdf`);
}

export function exportTPICrossRefPDF(
  client: string,
  handedness: Handedness,
  agg: AggregatedDiagnoses,
) {
  const doc = new jsPDF();
  const date = formatDate();
  const sides = resolveLeadTrail(handedness);

  let y = header(doc, "TPI CROSS-REFERENCE REPORT", BLUE, 15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#334155");
  doc.text(`PATIENT: ${client}`, 14, y + 3);
  doc.text(
    `${handedness === "right" ? "Right" : "Left"}-handed · Lead: ${sides.lead} / Trail: ${sides.trail}`,
    196, y + 3, { align: "right" }
  );
  y += 6;
  doc.setFontSize(8);
  doc.text(`DATE: ${date}`, 196, y + 3, { align: "right" });
  y += 8;

  y = header(doc, "PREDICTED SWING FAULTS FROM SFMA FINDINGS", "#334155", y);

  const allPredictions = predictSwingFaults(agg.terminalDiagnoses, handedness);
  const predictions = allPredictions.filter((p) => p.confidence !== "low");

  if (predictions.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor("#94a3b8");
    doc.text("No significant swing fault predictions from current SFMA findings.", 105, y + 4, { align: "center" });
    doc.save(`SFMA_TPI_CrossRef_${client.replace(/\s+/g, "_")}.pdf`);
    return;
  }

  for (const p of predictions) {
    y = checkPage(doc, y, 25);
    const conf = p.confidence === "high" ? "[HIGH]" : "[MODERATE]";
    y = subheader(doc, `${conf}  ${p.fault.name}  (${p.fault.phase.replace("_", " ")})`, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#64748b");
    doc.text(`Injury risk: ${p.injuryRisk.join(", ").replace(/_/g, " ")}`, 20, y + 2);
    y += 6;

    if (p.matchedDysfunctions.length > 0) {
      const dysfRows = p.matchedDysfunctions.map((d) => [d.type, d.description, d.laterality]);
      autoTable(doc, {
        startY: y,
        head: [["Type", "Dysfunction", "Laterality"]],
        body: dysfRows,
        margin: { left: 20, right: 20 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: RED, textColor: "#ffffff", fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 15, halign: "center", fontStyle: "bold" },
          1: { cellWidth: "auto" },
          2: { cellWidth: 25, halign: "center" },
        },
        didParseCell(data) {
          if (data.section === "body" && data.column.index === 0) {
            const t = data.cell.raw as string;
            data.cell.styles.textColor = t === "MD" ? "#ea580c" : "#2563eb";
          }
        },
      });
      y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
    }
  }

  doc.save(`SFMA_TPI_CrossRef_${client.replace(/\s+/g, "_")}.pdf`);
}
