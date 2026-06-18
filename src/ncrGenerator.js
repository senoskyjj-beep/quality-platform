import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, ImageRun
} from 'docx';
import { saveAs } from 'file-saver';

const TOTAL_WIDTH = 10466;
const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: '888888' };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const headerShading = { fill: '1F4E79', type: ShadingType.CLEAR };
const subHeaderShading = { fill: 'D9E2F3', type: ShadingType.CLEAR };
const fillShading = { fill: 'FFF2CC', type: ShadingType.CLEAR };

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before ?? 60, after: opts.after ?? 60 },
    children: [new TextRun({
      text, bold: opts.bold || false, italics: opts.italics || false,
      color: opts.color || '000000', size: opts.size || 20, font: 'Arial'
    })]
  });
}

function headerCell(text, width, span) {
  const cell = {
    borders: cellBorders, width: { size: width, type: WidthType.DXA },
    shading: headerShading, margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [p(text, { bold: true, color: 'FFFFFF', size: 20 })]
  };
  if (span) cell.columnSpan = span;
  return new TableCell(cell);
}

function subHeaderCell(text, width) {
  return new TableCell({
    borders: cellBorders, width: { size: width, type: WidthType.DXA },
    shading: subHeaderShading, margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [p(text, { bold: true, size: 20 })]
  });
}

function fillCell(text, width, height) {
  const cell = {
    borders: cellBorders, width: { size: width, type: WidthType.DXA },
    shading: fillShading, margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [p(text || ' ', { size: 20 })]
  };
  if (height) cell.height = { value: height, rule: 'atLeast' };
  return new TableCell(cell);
}

function base64ToUint8Array(b64) {
  const raw = b64.includes(',') ? b64.split(',')[1] : b64;
  const binary = atob(raw);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function photoCell(photoBase64, width, height) {
  if (!photoBase64) {
    return new TableCell({
      borders: cellBorders, width: { size: width, type: WidthType.DXA },
      margins: { top: 120, bottom: 120, left: 120, right: 120 },
      height: { value: height, rule: 'atLeast' },
      children: [p('[ No photo ]', { color: '888888', size: 18, align: AlignmentType.CENTER })]
    });
  }
  try {
    const imageBytes = base64ToUint8Array(photoBase64);
    return new TableCell({
      borders: cellBorders, width: { size: width, type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 80, right: 80 },
      height: { value: height, rule: 'atLeast' },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new ImageRun({ data: imageBytes, transformation: { width: 280, height: 200 } })]
      })]
    });
  } catch (e) {
    return new TableCell({
      borders: cellBorders, width: { size: width, type: WidthType.DXA },
      margins: { top: 120, bottom: 120, left: 120, right: 120 },
      children: [p('[ Photo error ]', { color: 'C00000', size: 18, align: AlignmentType.CENTER })]
    });
  }
}

export async function generateNCR(ncr, photos = []) {
  const safe = (v) => v || '';

  const titleTable = new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: [TOTAL_WIDTH],
    rows: [new TableRow({
      children: [new TableCell({
        borders: cellBorders, width: { size: TOTAL_WIDTH, type: WidthType.DXA },
        shading: headerShading, margins: { top: 120, bottom: 120, left: 120, right: 120 },
        children: [
          p('SITE NON-CONFORMANCE REPORT (NCR)', { bold: true, color: 'FFFFFF', size: 28, align: AlignmentType.CENTER }),
          p('Quality Assurance & Quality Control — Cape Town Logistics Warehouse Facility (EC0148)',
            { color: 'FFFFFF', size: 18, align: AlignmentType.CENTER, italics: true })
        ]
      })]
    })]
  });

  const idTable = new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: [2616, 2617, 2616, 2617],
    rows: [
      new TableRow({ children: [
        subHeaderCell('NCR No.', 2616), fillCell(safe(ncr.ncr_no), 2617),
        subHeaderCell('Date Raised', 2616), fillCell(safe(ncr.date_raised), 2617)
      ]}),
      new TableRow({ children: [
        subHeaderCell('Raised by — Role', 2616), fillCell(safe(ncr.raised_by_role), 2617),
        subHeaderCell('Raised by — Name', 2616), fillCell(safe(ncr.raised_by_name), 2617)
      ]}),
      new TableRow({ children: [
        subHeaderCell('Building', 2616), fillCell(safe(ncr.building), 2617),
        subHeaderCell('Area', 2616), fillCell(safe(ncr.area), 2617)
      ]}),
      new TableRow({ children: [
        subHeaderCell('Element Ref', 2616), fillCell(safe(ncr.element_ref), 2617),
        subHeaderCell('Severity', 2616), fillCell(safe(ncr.severity), 2617)
      ]}),
      new TableRow({ children: [
        subHeaderCell('Foreman', 2616), fillCell(safe(ncr.foreman_issued), 2617),
        subHeaderCell('Engineer Notified', 2616), fillCell(safe(ncr.engineer_notified), 2617)
      ]}),
    ]
  });

  const descTable = new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: [TOTAL_WIDTH],
    rows: [
      new TableRow({ children: [headerCell('1. DESCRIPTION OF NON-CONFORMANCE', TOTAL_WIDTH)] }),
      new TableRow({ children: [fillCell(safe(ncr.description) || ' ', TOTAL_WIDTH, 1800)] })
    ]
  });

  const photoRows = [new TableRow({ children: [headerCell('2. PHOTOGRAPHIC EVIDENCE', TOTAL_WIDTH, 2)] })];
  for (let i = 0; i < 4; i += 2) {
    const left = photos[i], right = photos[i + 1];
    photoRows.push(new TableRow({
      children: [
        new TableCell({
          borders: cellBorders, width: { size: TOTAL_WIDTH / 2, type: WidthType.DXA },
          shading: subHeaderShading, margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [p(`Photo ${i + 1}` + (left?.caption ? ` — ${left.caption}` : ''), { bold: true, size: 18 })]
        }),
        new TableCell({
          borders: cellBorders, width: { size: TOTAL_WIDTH / 2, type: WidthType.DXA },
          shading: subHeaderShading, margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [p(`Photo ${i + 2}` + (right?.caption ? ` — ${right.caption}` : ''), { bold: true, size: 18 })]
        })
      ]
    }));
    photoRows.push(new TableRow({
      children: [
        photoCell(left?.base64_data, TOTAL_WIDTH / 2, 4000),
        photoCell(right?.base64_data, TOTAL_WIDTH / 2, 4000),
      ]
    }));
  }
  const photoTable = new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: [TOTAL_WIDTH / 2, TOTAL_WIDTH / 2],
    rows: photoRows
  });

  const specTable = new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: [3500, 6966],
    rows: [
      new TableRow({ children: [headerCell('3. SANS / SPECIFICATION CLAUSE', TOTAL_WIDTH, 2)] }),
      new TableRow({ children: [subHeaderCell('Reference', 3500), fillCell(safe(ncr.sans_clause), 6966)] })
    ]
  });

  const actionTable = new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: [TOTAL_WIDTH],
    rows: [
      new TableRow({ children: [headerCell('4. CORRECTIVE ACTION REQUIRED', TOTAL_WIDTH)] }),
      new TableRow({ children: [fillCell(safe(ncr.action_required) || ' ', TOTAL_WIDTH, 1500)] }),
      new TableRow({ children: [fillCell(`Target close-out: ${safe(ncr.target_closeout)}    Status: ${safe(ncr.status)}`, TOTAL_WIDTH)] })
    ]
  });

  const signTable = new Table({
    width: { size: TOTAL_WIDTH, type: WidthType.DXA },
    columnWidths: [3489, 3488, 3489],
    rows: [
      new TableRow({ children: [headerCell('5. ISSUED & ACKNOWLEDGED', TOTAL_WIDTH, 3)] }),
      new TableRow({ children: [
        subHeaderCell('Issued by', 3489),
        subHeaderCell('Acknowledged by (Foreman)', 3488),
        subHeaderCell('Closed-out / Verified', 3489)
      ]}),
      new TableRow({ children: [
        fillCell('Name:\n\nSignature:\n\nDate:', 3489, 1500),
        fillCell('Name:\n\nSignature:\n\nDate:', 3488, 1500),
        fillCell('Name:\n\nSignature:\n\nDate:', 3489, 1500)
      ]})
    ]
  });

  const doc = new Document({
    creator: 'QA Portal v2', title: `NCR ${safe(ncr.ncr_no)}`,
    styles: { default: { document: { run: { font: 'Arial', size: 20 } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      headers: { default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: `EC0148 NCR ${safe(ncr.ncr_no)}`, size: 16, color: '888888', font: 'Arial' })]
      })]})},
      footers: { default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'Page ', size: 16, color: '888888', font: 'Arial' }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888', font: 'Arial' }),
          new TextRun({ text: ' of ', size: 16, color: '888888', font: 'Arial' }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '888888', font: 'Arial' }),
        ]
      })]})},
      children: [
        titleTable, new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: '' })] }),
        idTable, new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: '' })] }),
        descTable, new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: '' })] }),
        photoTable, new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: '' })] }),
        specTable, new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: '' })] }),
        actionTable, new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: '' })] }),
        signTable,
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const today = new Date().toISOString().split('T')[0];
  const filename = `NCR_${safe(ncr.ncr_no) || 'draft'}_${today}.docx`;
  saveAs(blob, filename);
  return filename;
}
