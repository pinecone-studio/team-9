type PrintEmployee = {
  id: string;
  name: string;
};

type BuildAcceptedEmployeesPrintHtmlInput = {
  benefit: string;
  benefitId: string;
  employees: PrintEmployee[];
  printedDate: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatPrintedDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

const PRINT_STYLES = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #f5f5f5; }
  body { font-family: Arial, sans-serif; }
  .status { padding: 24px; color: #525252; font-size: 14px; line-height: 1.5; }
  .error { color: #b91c1c; }
  .page { break-after: page; page-break-after: always; display: flex; justify-content: center; align-items: flex-start; padding: 0; }
  .page:last-child { break-after: auto; page-break-after: auto; }
  .sheet { position: relative; overflow: hidden; background: white; }
  .template { display: block; width: 100%; height: 100%; }
  @media print { html, body { background: white; } }
`;

const PRINT_SCRIPT = String.raw`
  import * as pdfjs from "/pdf.min.mjs";
  const payload = JSON.parse(document.getElementById("payload")?.textContent || "{}");
  const statusElement = document.getElementById("status");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  function escapeHtml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }

  function findPlaceholderMatches(text) {
    const matches = [];
    const patterns = [
      { kind: "name", regex: /\{\{\s*name\s*\}\}/gi },
      { kind: "date", regex: /\{\{\s*date\s*\}\}/gi },
    ];
    patterns.forEach(({ kind, regex }) => {
      let match = regex.exec(text);
      while (match) {
        matches.push({ end: match.index + match[0].length, kind, start: match.index });
        match = regex.exec(text);
      }
    });
    return matches.sort((left, right) => left.start - right.start);
  }

  function buildPagesHtml(employees) {
    return employees.flatMap((employee) =>
      employee.pages.map((page) =>
        '<section class="page"><div class="sheet" style="width:' + page.width + 'px;height:' + page.height + 'px;"><img alt="' + escapeHtml(employee.name) + ' contract" class="template" src="' + page.imageDataUrl + '" /></div></section>',
      ),
    ).join("");
  }

  async function renderPrintablePages(employeeName, pdfBytes, printedDate) {
    const loadingTask = pdfjs.getDocument({ data: pdfBytes, disableWorker: true });
    const pdfDocument = await loadingTask.promise;
    const renderedPages = [];

    for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex += 1) {
      const page = await pdfDocument.getPage(pageIndex);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const canvasContext = canvas.getContext("2d");
      if (!canvasContext) throw new Error("Failed to prepare PDF canvas.");

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, canvasContext, viewport }).promise;

      const textContent = await page.getTextContent();
      textContent.items.forEach((item) => {
        if (!("str" in item) || typeof item.str !== "string") return;
        const matches = findPlaceholderMatches(item.str);
        if (matches.length === 0) return;

        const transform = pdfjs.Util.transform(viewport.transform, item.transform);
        const totalWidth = Math.max(item.width * viewport.scale, 1);
        const fontHeight = Math.max(item.height * viewport.scale, 12);
        const baseX = transform[4];
        const baseY = transform[5];
        const textLength = Math.max(item.str.length, 1);

        matches.forEach((match) => {
          const replacement = match.kind === "name" ? employeeName : printedDate;
          const matchWidth = totalWidth * ((match.end - match.start) / textLength);
          const matchX = baseX + totalWidth * (match.start / textLength);
          const rectY = baseY - fontHeight * 0.85;
          canvasContext.fillStyle = "#FFFFFF";
          canvasContext.fillRect(matchX - 2, rectY - 1, matchWidth + 6, fontHeight + 4);
          canvasContext.fillStyle = "#111827";
          canvasContext.font = fontHeight + "px Arial";
          canvasContext.textBaseline = "alphabetic";
          canvasContext.fillText(replacement, matchX, baseY);
        });
      });

      renderedPages.push({
        height: Math.round(viewport.height / 2),
        imageDataUrl: canvas.toDataURL("image/png"),
        width: Math.round(viewport.width / 2),
      });
    }

    return renderedPages;
  }

  async function main() {
    try {
      const response = await fetch("/api/contracts/benefits/" + encodeURIComponent(payload.benefitId) + "/file", { cache: "no-store" });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to download the contract PDF.");
      }

      const pdfBytes = new Uint8Array(await response.arrayBuffer());
      const printableEmployees = [];
      for (const employee of payload.employees) {
        if (statusElement) statusElement.textContent = "Preparing " + employee.name + "...";
        const pages = await renderPrintablePages(employee.name, pdfBytes, payload.printedDate);
        printableEmployees.push({ ...employee, pages });
      }

      document.body.innerHTML = buildPagesHtml(printableEmployees);
      window.setTimeout(() => {
        window.focus();
        window.print();
      }, 250);
    } catch (error) {
      if (!statusElement) return;
      statusElement.classList.add("error");
      statusElement.textContent = error instanceof Error ? error.message : "Failed to prepare the printable PDF.";
    }
  }

  void main();
`;

export function buildAcceptedEmployeesPrintHtml(
  input: BuildAcceptedEmployeesPrintHtmlInput,
) {
  const payload = JSON.stringify(input).replaceAll("<", "\\u003c");

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(input.benefit)} Print</title>
        <style>${PRINT_STYLES}</style>
      </head>
      <body>
        <div class="status" id="status">Preparing print preview...</div>
        <script id="payload" type="application/json">${payload}</script>
        <script type="module">${PRINT_SCRIPT}</script>
      </body>
    </html>`;
}
