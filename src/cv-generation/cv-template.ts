import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Footer,
  SectionType,
  Header,
  PageNumber,
  ImageRun,
} from "docx";
import { Packer } from "docx";

import logo from "../assets/pmx_logo.png";

// ===============
// ---- TYPES ----
// ===============

export interface Education {
  institution: string;
  degree?: string;
  major?: string;
  start_date: string;
  end_date: string;
  location: string;
  thesis: string;
  specialization: string;
  details?: string[];
}

export interface Experience {
  employer: string;
  location?: string;
  project: string;
  job_title: string;
  job_description: string[];
  start_date: string;
  end_date: string | null;
  contractType?: string;
}

export interface Skills {
  Fachkenntnisse: string[];
  Sprachkenntnisse: string[];
  other_skills: String[];
}

export interface Certifications {
  name: string;
  details: string;
  issuer?: string;
  issued_date?: string;
  expiry_date?: string;
}

export interface Training {
  name: string;
  details?: string;
  start_date?: string;
  end_date?: string;
}

export interface CVData {
  firstName: string;
  lastName: string;
  highest_degree: string;
  specialization: string;
  email: string;
  phone: string;
  education: Education[];
  certifications: Certifications[];
  experience: Experience[];
  skills: Skills;
  birthday: Date;
  nationality: string;
  image?: string;
  training: Training[];
}

// ================
// ---- ASSETS ----
// ================

if (typeof logo !== "string") throw new Error("Logo import failed");

const parts = logo.split(",");
if (parts.length < 2) throw new Error("Invalid data URL");

const buffer = Buffer.from(parts[1] as string, "base64");

// ========================
// ---- Main Generator ----
// ========================
export async function generateDocx(cvData: CVData): Promise<Buffer> {
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: "Franklin Gothic Book",
            size: 20,
            color: "000000",
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      ],
    },
    sections: [
      {
        properties: { type: SectionType.CONTINUOUS },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new ImageRun({
                    type: "png",
                    data: buffer,
                    transformation: {
                      width: 52,
                      height: 42,
                    },
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: "{logged user name}",
                    size: 16,
                    color: "666666",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: "pmX GmbH | Kegelenstr. 3 | 70372 Stuttgart ",
                    size: 16,
                    color: "666666",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: "{logged user email} | {logged user phone nr}",
                    size: 16,
                    color: "666666",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    children: [
                      "Seite ",
                      PageNumber.CURRENT,
                      " von ",
                      PageNumber.TOTAL_PAGES,
                    ],
                    size: 16,
                    color: "666666",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...createQualificationsProfile(cvData),
          ...createSkillsSection(cvData),
          ...createProfessionalExperience(cvData),
          ...createEducationSection(cvData),
          ...createOfferDetails(cvData),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// ========================
// ---- QUALIFICATIONS ----
// ========================

import { Table, TableRow, TableCell, WidthType } from "docx";

function getImageTypeFromDataUri(dataUri: string): "png" | "jpg" {
  if (dataUri.startsWith("data:image/png")) {
    return "png";
  } else if (
    dataUri.startsWith("data:image/jpeg") ||
    dataUri.startsWith("data:image/jpg")
  ) {
    return "jpg";
  }
  return "jpg";
}

export function createQualificationsProfile(
  cvData: CVData
): (Paragraph | Table)[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "QUALIFIKATIONSPROFIL",
          size: 40,
        }),
      ],
    }),
    new Paragraph({ text: "" }),

    new Table({
      rows: [
        new TableRow({
          children: [
            // Left column: image or placeholder
            cvData.image
              ? new TableCell({
                  verticalAlign: "center",
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  margins: { right: 300 },
                  children: [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          type: getImageTypeFromDataUri(cvData.image),
                          data: base64ToBuffer(cvData.image),
                          transformation: { width: 155, height: 234 },
                        }),
                      ],
                    }),
                  ],
                  borders: noBorders,
                })
              : new TableCell({
                  verticalAlign: "center",
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  margins: { right: 300, left: 300 },
                  children: [
                    new Paragraph({
                      spacing: { line: 420 },
                      alignment: "center",
                      children: [
                        new TextRun({
                          text: "No image available.",
                          size: 28,
                          bold: true,
                          color: "7F7F7F",
                        }),
                      ],
                    }),
                  ],
                  borders: {
                    top: { style: "single", size: 2, color: "7F7F7F" },
                    bottom: { style: "single", size: 2, color: "7F7F7F" },
                    left: { style: "single", size: 2, color: "7F7F7F" },
                    right: { style: "single", size: 2, color: "7F7F7F" },
                  },
                }),
            // Right column: text
            new TableCell({
              verticalAlign: "center",
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { left: 300 },
              children: [
                ...createVerticalSpacer(2),
                new Paragraph({
                  spacing: { line: 420 },
                  children: [
                    new TextRun({
                      text: `    ${cvData.firstName} ${cvData.lastName}`,
                      size: 28,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({ text: "", spacing: { line: 420 } }),

                makeInfoRow("Höchster Abschluss:", cvData.highest_degree),
                makeInfoRow("Fachrichtung:", cvData.specialization),
                makeInfoRow("Geburtsdatum:", cvData.birthday),
                makeInfoRow("Nationalität:", cvData.nationality),
              ],
              borders: noBorders,
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders,
    }),

    ...createVerticalSpacer(1),
  ];
}

// ==============================================
// ---- SKILLS SECTION ----
// ==============================================

export function createSkillsSection(cvData: CVData): (Paragraph | Table)[] {
  const fachkenntnisse = cvData.skills.Fachkenntnisse || [];
  const otherSkills = cvData.skills.other_skills || [];

  const allFachkenntnisse = [...fachkenntnisse];
  if (otherSkills.length > 0) {
    allFachkenntnisse.push(`Other skills: ${otherSkills.join(", ")}`);
  }

  const categories = [
    { name: "Fachkenntnisse", skills: allFachkenntnisse },
    { name: "Sprachkenntnisse", skills: cvData.skills.Sprachkenntnisse },
  ];

  // Create table rows for skills
  const rows: TableRow[] = categories.map(
    (category) =>
      new TableRow({
        children: [
          // Category name column
          new TableCell({
            children: [
              new Paragraph({
                spacing: { line: 360 },
                children: [
                  new TextRun({
                    text: category.name,
                    bold: true,
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          // Skills for that category
          new TableCell({
            children: [
              new Paragraph({
                spacing: { line: 360 },
                children: [
                  new TextRun({
                    text: category.skills.join(", "),
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
            width: { size: 60, type: WidthType.PERCENTAGE },
          }),
        ],
      })
  );

  const headingTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 50, bottom: 50, left: 150, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "METHODEN- / SYSTEMKOMPETENZ / SPRACHKENNTNISSE",
                    font: "Franklin Gothic Book",
                    size: generalFontSize,
                    bold: true,
                    color: "#000000",
                  }),
                ],
              }),
            ],
            shading: { fill: "#a0a727" },
            borders: noBorders,
          }),
        ],
      }),
    ],
  });

  return [
    headingTable,
    ...createVerticalSpacer(1), // spacing
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }),
    ...createVerticalSpacer(1),
  ];
}

// ==================================================
// ----PROFESSIONAL EXPERIENCE ----
// ==================================================

export function createProfessionalExperience(cvData: {
  experience: any[];
}): (Paragraph | Table)[] {
  const result: (Paragraph | Table)[] = [];

  // Heading as a table cell
  const headingTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 50, bottom: 50, left: 150, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "BERUFLICHER WERDEGANG / PROJEKTKOMPETENZ",
                    font: "Franklin Gothic Book",
                    size: generalFontSize,
                    bold: true,
                    color: "#000000",
                  }),
                ],
              }),
            ],
            shading: { fill: "#a0a727" },
            borders: noBorders,
          }),
        ],
      }),
    ],
  });

  result.push(headingTable);
  result.push(...createVerticalSpacer(1));

  cvData.experience.forEach((mainExp) => {
    // Case 1: nested experiences
    if (mainExp.experiences && Array.isArray(mainExp.experiences)) {
      mainExp.experiences.forEach((exp: any) => {
        addExperienceToResult(mainExp.job_title, exp, result);
      });
    }
    // Case 2: flat experience
    else {
      addExperienceToResult(mainExp.job_title, mainExp, result);
    }
  });

  return result;
}

function addExperienceToResult(jobTitle: string, exp: any, result: any) {
  const bullets = (exp.job_description ?? []).map(
    (desc: string) =>
      new Paragraph({
        children: [
          new TextRun({
            text: desc,
            size: generalFontSize,
          }),
        ],
        bullet: { level: 0 },
        spacing: { before: 30, after: 30 },
      })
  );

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatDateRange(exp.start_date, exp.end_date),
                    size: generalFontSize,
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
            verticalAlign: "top",
            borders: noBorders,
          }),
          new TableCell({
            width: { size: 7000, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: jobTitle ?? "",
                    bold: true,
                    size: generalFontSize,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: exp.employer ?? "",
                    bold: true,
                    size: generalFontSize,
                  }),
                  new TextRun({
                    text: exp.location ? ", " + exp.location : "",
                    size: generalFontSize,
                  }),
                  new TextRun({
                    text: exp.contractType ? " (" + exp.contractType + ")" : "",
                    size: generalFontSize,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: exp.project ? exp.project : "",
                    size: generalFontSize,
                  }),
                ],
              }),
              ...bullets,
            ],
            verticalAlign: "top",
            borders: noBorders,
          }),
        ],
      }),
    ],
    width: { size: 10000, type: WidthType.DXA },
  });

  result.push(table);
  result.push(...createVerticalSpacer(1));
}

// ====================================
// ---- EDUCATION ----
// ====================================

export function createEducationSection(cvData: CVData): (Paragraph | Table)[] {
  const result: (Paragraph | Table)[] = [];

  const headingTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 50, bottom: 50, left: 150, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "AUSBILDUNG",
                    font: "Franklin Gothic Book",
                    size: generalFontSize,
                    bold: true,
                    color: "#000000",
                  }),
                ],
              }),
            ],
            shading: { fill: "#a0a727" },
            borders: noBorders,
          }),
        ],
      }),
    ],
  });

  result.push(headingTable);
  result.push(...createVerticalSpacer(1));

  const rows: TableRow[] = [];

  // Education rows
  cvData.education.forEach((edu) => {
    const rightCellParagraphs: Paragraph[] = [];

    if (edu.degree || edu.major) {
      rightCellParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [edu.degree, edu.major].filter(Boolean).join(", "),
              bold: true,
              size: generalFontSize,
            }),
          ],
        })
      );
    }

    if (edu.institution || edu.location) {
      rightCellParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [edu.institution, edu.location].filter(Boolean).join(", "),
              size: generalFontSize,
            }),
          ],
        })
      );
    }

    if (edu.thesis) {
      rightCellParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Thema der Thesis: "${edu.thesis}"`,
              size: generalFontSize,
            }),
          ],
        })
      );
    }

    if (edu.specialization) {
      rightCellParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Vertiefungsrichtungen: ${edu.specialization}`,
              size: generalFontSize,
            }),
          ],
        })
      );
    }

    if (edu.details?.length) {
      edu.details.forEach((d) => {
        rightCellParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: d, size: generalFontSize })],
            bullet: { level: 0 },
            spacing: { before: 30, after: 30 },
          })
        );
      });
    }

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatDateRange(edu.start_date, edu.end_date),
                    size: generalFontSize,
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
            verticalAlign: "top",
            borders: noBorders,
          }),
          new TableCell({
            width: { size: 7000, type: WidthType.DXA },
            children: rightCellParagraphs,
            verticalAlign: "top",
            borders: noBorders,
          }),
        ],
      })
    );
  });

  //training
  cvData.training?.forEach((training) => {
    const rightCellParagraphs: Paragraph[] = [];

    rightCellParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: training.name,
            bold: true,
            size: generalFontSize,
          }),
        ],
      })
    );

    if (training.details) {
      rightCellParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: training.details,
              size: generalFontSize,
            }),
          ],
        })
      );
    }

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text:
                      training.start_date || training.end_date
                        ? formatDateRange(
                            training.start_date,
                            training.end_date
                          )
                        : "No date mentioned",
                    size: generalFontSize,
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
            verticalAlign: "top",
            borders: noBorders,
          }),
          new TableCell({
            width: { size: 7000, type: WidthType.DXA },
            children: rightCellParagraphs,
            verticalAlign: "top",
            borders: noBorders,
          }),
        ],
      })
    );
  });

  // Certification rows
  cvData.certifications?.forEach((cert) => {
    const rightCellParagraphs: Paragraph[] = [];

    rightCellParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cert.name,
            bold: true,
            size: generalFontSize,
          }),
        ],
      })
    );

    if (cert.issuer) {
      rightCellParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.issuer,
              size: generalFontSize,
            }),
          ],
        })
      );
    }

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text:
                      cert.issued_date || cert.expiry_date
                        ? formatDateRange(cert.issued_date, cert.expiry_date)
                        : "No date mentioned",
                    size: generalFontSize,
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
            verticalAlign: "top",
            borders: noBorders,
          }),
          new TableCell({
            width: { size: 7000, type: WidthType.DXA },
            children: rightCellParagraphs,
            verticalAlign: "top",
            borders: noBorders,
          }),
        ],
      })
    );
  });

  // Build one table with all rows
  const mainTable = new Table({
    rows,
    width: { size: 10000, type: WidthType.DXA },
  });

  result.push(mainTable);
  result.push(...createVerticalSpacer(1));

  return result;
}

// ==========================================
// ---- OFFER DETAILS ----
// ==========================================

export function createOfferDetails(cvData: CVData): (Paragraph | Table)[] {
  const result: (Paragraph | Table)[] = [];

  // Heading table
  const headingTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 50, bottom: 50, left: 150, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "ANGEBOTSDETAILS",
                    font: "Franklin Gothic Book",
                    size: generalFontSize,
                    bold: true,
                    color: "#000000",
                  }),
                ],
              }),
            ],
            shading: { fill: "#a0a727" },
            borders: noBorders,
          }),
        ],
      }),
    ],
  });

  result.push(headingTable);
  result.push(...createVerticalSpacer(1));

  // Two-column table for details
  const detailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Vertragsart:",
                    bold: true,
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Arbeitnehmerüberlassung",
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Verfügbarkeit:",
                    bold: true,
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "ab sofort", size: generalFontSize }),
                ],
              }),
            ],
            borders: noBorders,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Voraussichtliche Dauer:",
                    bold: true,
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Über den gewünschten Zeitraum",
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Kaufmännische Daten:",
                    bold: true,
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Über den gewünschten Zeitraum",
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Referenznummer:",
                    bold: true,
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: ``,
                    size: generalFontSize,
                  }),
                ],
              }),
            ],
            borders: noBorders,
          }),
        ],
      }),
    ],
  });

  result.push(detailsTable);
  result.push(...createVerticalSpacer(1));

  result.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Bitte beachten Sie, dass Sie nach den geltenden datenschutzrechtlichen Bestimmungen grundsätzlich dazu verpflichtet sind, personenbezogene Daten zu löschen, wenn der Zweck der Verarbeitung entfallen ist.",
          size: 16,
          color: "444444",
        }),
      ],
    })
  );

  return result;
}

// ===============
// ---- UTILS ----
// ===============

import { BorderStyle } from "docx";

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  // Add validation for start parameter
  if (!start) {
    return "Date not specified";
  }

  const format = (isoDate: string): string => {
    const [year, month] = isoDate.split("-");
    return `${month} / ${year}`;
  };

  if (!end) {
    return format(start);
  }

  if (end.toLowerCase().trim() === "heute") {
    return `${format(start)} – heute`;
  }

  return `${format(start)} – ${format(end)}`;
}

/**
 * Returns an array of empty Paragraphs for vertical spacing in docx documents.
 * @param count Number of empty paragraphs (default: 1)
 */
export function createVerticalSpacer(count = 1): Paragraph[] {
  return Array.from({ length: count }, () => new Paragraph({ text: "" }));
}

const generalFontSize = 22;

export function makeInfoRow(label: string, value: any) {
  return new Paragraph({
    spacing: { line: 420 },
    tabStops: [
      {
        type: "left",
        position: 2150,
      },
    ],
    children: [
      new TextRun({
        text: label,
        size: generalFontSize,
        bold: true,
      }),
      new TextRun({
        text: "\t" + (value ?? ""),
        size: generalFontSize,
      }),
    ],
  });
}

export function getEducationField(education: Education[]): string {
  return education[0]?.major ?? "";
}

export function base64ToBuffer(dataUri: string): Buffer {
  const base64 = dataUri.split(",")[1];
  if (!base64) {
    throw new Error("Invalid data URI: missing base64 part");
  }
  return Buffer.from(base64, "base64");
}
