import http, { IncomingMessage, ServerResponse } from "http";
import { generateDocx } from "./cv-generation/cv-template.js";
import type { CVData } from "./cv-generation/cv-template.js";

async function getJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function createFilename(cvData: CVData) {
  const { firstName = "unknown", lastName = "unknown" } = cvData || {};

  const normalize = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/^\p{L}/u, (c) => c.toUpperCase());

  const filename = `CV_${normalize(firstName)}_${normalize(
    lastName
  )}.docx`.replace(/[^\p{L}\p{N}._-]+/gu, "_");

  return filename;
}

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url === "/generate") {
      try {
        const json = await getJsonBody(req);
        const filename = createFilename(json);
        const buffer = await generateDocx(json);

        res.writeHead(200, {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${filename}"`,
        });

        res.end(buffer);
        return;
      } catch (err: any) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
);

server.listen(3001, () => {
  console.log(" DOCX service running on :3001");
});
