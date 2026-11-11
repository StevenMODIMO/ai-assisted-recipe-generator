import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface RecipePdfData {
  title: string;
  description?: string;
  ingredients: { name: string; measure?: string }[];
  instructions: string;
  category?: string;
  area?: string;
  isAiModified: boolean;
  updatedAt: string;
}

type InstructionBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "step"; text: string; number: string }
  | { kind: "bullet"; text: string };

const PAGE_MARGIN = 18;
const FOOTER_SPACE = 20;
const BRAND_GREEN: [number, number, number] = [125, 183, 20];
const TEXT_COLOR: [number, number, number] = [43, 52, 36];
const MUTED_COLOR: [number, number, number] = [105, 113, 99];

function cleanText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[\u2022\u00b7]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/[^\u0000-\u00ff]/g, "")
    .trim();
}

function cleanMarkdown(value: string) {
  return cleanText(value)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1")
    .replace(/(?<!_)_([^_]+)_(?!_)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function parseInstructions(markdown: string): InstructionBlock[] {
  const blocks: InstructionBlock[] = [];

  for (const rawLine of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const heading = line.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      const text = cleanMarkdown(heading[1]);
      if (text && !/^instructions?$/i.test(text)) {
        blocks.push({ kind: "heading", text });
      }
      continue;
    }

    const numbered = line.match(/^\s*(\d{1,2})[.)]\s+(.+)$/);
    if (numbered) {
      blocks.push({
        kind: "step",
        number: numbered[1],
        text: cleanMarkdown(numbered[2]),
      });
      continue;
    }

    const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
    if (bullet) {
      blocks.push({ kind: "bullet", text: cleanMarkdown(bullet[1]) });
      continue;
    }

    blocks.push({ kind: "paragraph", text: cleanMarkdown(line) });
  }

  return blocks.filter((block) => block.text.length > 0);
}

async function loadLogoDataUrl() {
  const response = await fetch("/Recipely%20Fresh%20Chef%20Logo.png");
  if (!response.ok) {
    throw new Error("Unable to load the Recipely logo for the recipe PDF.");
  }

  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to prepare the Recipely logo for the PDF."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () =>
      reject(new Error("Unable to prepare the Recipely logo for the PDF."));
    reader.readAsDataURL(blob);
  });
}

function drawHeader(doc: jsPDF, logo: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, pageWidth, 2.5, "F");
  doc.addImage(logo, "PNG", PAGE_MARGIN, 7, 37, 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("YOUR PERSONAL COOKBOOK", pageWidth - PAGE_MARGIN, 16, {
    align: "right",
  });
  doc.setDrawColor(225, 232, 214);
  doc.setLineWidth(0.35);
  doc.line(PAGE_MARGIN, 29, pageWidth - PAGE_MARGIN, 29);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.setTextColor(247, 249, 242);
  doc.text("RECIPES, MADE YOURS", pageWidth / 2, 166, {
    align: "center",
    angle: 35,
  });
}

function drawFooter(doc: jsPDF, page: number, pageCount: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(225, 232, 214);
  doc.setLineWidth(0.35);
  doc.line(PAGE_MARGIN, pageHeight - 14, pageWidth - PAGE_MARGIN, pageHeight - 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("Made with Recipely - recipes, made yours.", PAGE_MARGIN, pageHeight - 8);
  doc.setTextColor(...BRAND_GREEN);
  doc.text(`${page} / ${pageCount}`, pageWidth - PAGE_MARGIN, pageHeight - 8, {
    align: "right",
  });
}

export async function downloadRecipePdf(recipe: RecipePdfData) {
  const logo = await loadLogoDataUrl();
  const doc = new jsPDF({ format: "a4", unit: "mm", compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  const bottomLimit = pageHeight - FOOTER_SPACE;

  drawHeader(doc, logo);

  let y = 39;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(...TEXT_COLOR);
  const titleLines = doc.splitTextToSize(cleanText(recipe.title), contentWidth);
  doc.text(titleLines, PAGE_MARGIN, y);
  y += titleLines.length * 10 + 3;

  const tags = [recipe.category, recipe.area, recipe.isAiModified ? "AI tweaked" : ""]
    .filter((tag): tag is string => Boolean(tag))
    .map(cleanText);
  if (tags.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(85, 130, 12);
    doc.text(tags.join("  |  "), PAGE_MARGIN, y);
    y += 7;
  }

  if (recipe.description?.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED_COLOR);
    const descriptionLines = doc.splitTextToSize(
      cleanText(recipe.description),
      contentWidth,
    );
    doc.text(descriptionLines, PAGE_MARGIN, y);
    y += descriptionLines.length * 5 + 5;
  } else {
    y += 2;
  }

  doc.setFillColor(245, 249, 238);
  doc.roundedRect(PAGE_MARGIN, y, contentWidth, 13, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_COLOR);
  doc.text("SAVED VERSION", PAGE_MARGIN + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_COLOR);
  const savedDate = new Date(recipe.updatedAt);
  doc.text(
    `Updated ${Number.isNaN(savedDate.getTime()) ? "recently" : savedDate.toLocaleDateString()}`,
    PAGE_MARGIN + 4,
    y + 10,
  );
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...TEXT_COLOR);
  doc.text("INGREDIENTS", PAGE_MARGIN, y);
  y += 3;

  autoTable(doc, {
    startY: y,
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN, top: 38, bottom: FOOTER_SPACE },
    head: [["AMOUNT", "INGREDIENT"]],
    body:
      recipe.ingredients.length > 0
        ? recipe.ingredients.map((ingredient) => [
            cleanText(ingredient.measure?.trim() || "As needed"),
            cleanText(ingredient.name),
          ])
        : [["-", "No ingredients listed"]],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      textColor: TEXT_COLOR,
      lineColor: [225, 232, 214],
      lineWidth: 0.2,
      cellPadding: 3,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: BRAND_GREEN,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [248, 250, 244] },
    columnStyles: { 0: { cellWidth: 42, fontStyle: "bold" } },
    willDrawPage: (data) => {
      if (data.pageNumber > 1) drawHeader(doc, logo);
    },
  });

  const tableEndY = (
    doc as jsPDF & { lastAutoTable?: { finalY: number } }
  ).lastAutoTable?.finalY;
  y = (tableEndY ?? y) + 12;

  const blocks = parseInstructions(recipe.instructions);
  if (y + 14 > bottomLimit) {
    doc.addPage();
    drawHeader(doc, logo);
    y = 40;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...TEXT_COLOR);
  doc.text("METHOD", PAGE_MARGIN, y);
  y += 8;

  let stepNumber = 0;
  for (const block of blocks) {
    const isHeading = block.kind === "heading";
    const isStep = block.kind === "step";
    const isBullet = block.kind === "bullet";
    const leftInset = isStep ? 11 : isBullet ? 5 : 0;
    const lines = doc.splitTextToSize(
      block.text,
      contentWidth - leftInset,
    ) as string[];
    const lineHeight = isHeading ? 5.5 : 5;
    const blockHeight = lines.length * lineHeight + (isHeading ? 3 : 2);

    if (y + blockHeight > bottomLimit) {
      doc.addPage();
      drawHeader(doc, logo);
      y = 40;
    }

    if (isHeading) {
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(85, 130, 12);
      doc.text(block.text.toUpperCase(), PAGE_MARGIN, y);
      y += lineHeight + 2;
      continue;
    }

    doc.setFont("helvetica", isStep ? "bold" : "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXT_COLOR);
    if (isStep) {
      stepNumber += 1;
      doc.setFillColor(237, 246, 222);
      doc.circle(PAGE_MARGIN + 2.5, y - 1, 2.5, "F");
      doc.setTextColor(85, 130, 12);
      doc.setFontSize(8);
      doc.text(block.number || String(stepNumber), PAGE_MARGIN + 2.5, y + 0.3, {
        align: "center",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
    } else if (isBullet) {
      doc.setFillColor(...BRAND_GREEN);
      doc.circle(PAGE_MARGIN + 1.5, y - 1, 0.7, "F");
    }
    doc.text(lines, PAGE_MARGIN + leftInset, y);
    y += lines.length * lineHeight + 3;
  }

  if (blocks.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED_COLOR);
    doc.text("No cooking instructions were included.", PAGE_MARGIN, y);
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    drawFooter(doc, page, pageCount);
  }

  const fileName =
    cleanText(recipe.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "recipe";
  doc.save(`${fileName}-recipely.pdf`);
}
