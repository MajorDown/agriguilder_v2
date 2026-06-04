import { ReinitializationReport } from "@/modules/reinitialization/reinitialization.types";

type PdfTextEntry = {
    text: string;
    x: number;
    y: number;
    font: "F1" | "F2" | "F3" | "F4";
    size: number;
};

class PdfManager {
    private static readonly pageWidth = 842;
    private static readonly pageHeight = 595;

    private static escape(value: string): string {
        return value
            .replace(/\\/g, "\\\\")
            .replace(/\(/g, "\\(")
            .replace(/\)/g, "\\)");
    }

    private static normalize(value: string): string {
        return value
            .replace(/€/g, "EUR")
            .replace(/[•⋈]/g, "*")
            .replace(/\s+/g, " ")
            .trim();
    }

    private static truncate(value: string, maxLength: number): string {
        if (value.length <= maxLength) {
            return value;
        }

        return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
    }

    private static formatNumber(value: number): string {
        return value.toFixed(2).replace(".", ",");
    }

    private static buildContent(entries: PdfTextEntry[]): string {
        return entries
            .map((entry) => {
                const text = this.escape(this.normalize(entry.text));
                return `BT /${entry.font} ${entry.size} Tf ${entry.x} ${entry.y} Td (${text}) Tj ET`;
            })
            .join("\n");
    }

    private static createPdfDocument(pageContents: string[]): Buffer {
        const objects: string[] = [];
        const addObject = (content: string) => {
            objects.push(content);
            return objects.length;
        };

        const fontObjectId = {
            helvetica: addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
            helveticaBold: addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"),
            courier: addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>"),
            courierBold: addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>"),
        };

        const pagesId = addObject("<< /Type /Pages /Kids [] /Count 0 >>");
        const pageIds: number[] = [];

        for (const pageContent of pageContents) {
            const streamId = addObject(
                `<< /Length ${Buffer.byteLength(pageContent, "latin1")} >>\nstream\n${pageContent}\nendstream`
            );

            const pageId = addObject(
                `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}] /Resources << /Font << /F1 ${fontObjectId.helvetica} 0 R /F2 ${fontObjectId.helveticaBold} 0 R /F3 ${fontObjectId.courier} 0 R /F4 ${fontObjectId.courierBold} 0 R >> >> /Contents ${streamId} 0 R >>`
            );

            pageIds.push(pageId);
        }

        objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
        const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

        let pdf = "%PDF-1.4\n";
        const offsets: number[] = [0];

        objects.forEach((object, index) => {
            offsets[index + 1] = Buffer.byteLength(pdf, "latin1");
            pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
        });

        const xrefOffset = Buffer.byteLength(pdf, "latin1");
        pdf += `xref\n0 ${objects.length + 1}\n`;
        pdf += "0000000000 65535 f \n";

        for (let index = 1; index <= objects.length; index++) {
            pdf += `${offsets[index].toString().padStart(10, "0")} 00000 n \n`;
        }

        pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

        return Buffer.from(pdf, "latin1");
    }

    static buildReinitializationReport(report: ReinitializationReport): Buffer {
        const firstPageRows = 18;
        const nextPageRows = 24;
        const pages: PdfTextEntry[][] = [];
        const rows = report.lines.length > 0 ? report.lines : [{
            memberId: "none",
            firstname: "",
            lastname: "Aucun membre actif",
            email: "",
            pointsBalance: 0,
            euroValue: 0,
        }];

        const chunks: typeof rows[] = [];
        let cursor = 0;

        while (cursor < rows.length) {
            const chunkSize = cursor === 0 ? firstPageRows : nextPageRows;
            chunks.push(rows.slice(cursor, cursor + chunkSize));
            cursor += chunkSize;
        }

        if (chunks.length === 0) {
            chunks.push([]);
        }

        chunks.forEach((chunk, pageIndex) => {
            const entries: PdfTextEntry[] = [];
            let y = 555;

            if (pageIndex === 0) {
                entries.push({
                    text: "Rapport de reinitialisation de guilde",
                    x: 40,
                    y,
                    font: "F2",
                    size: 18,
                });
                y -= 28;
                entries.push({
                    text: `Guilde precedente : ${report.previousGuildName}`,
                    x: 40,
                    y,
                    font: "F1",
                    size: 11,
                });
                y -= 16;
                entries.push({
                    text: `Guilde appliquee : ${report.guildName}`,
                    x: 40,
                    y,
                    font: "F1",
                    size: 11,
                });
                y -= 16;
                entries.push({
                    text: `Validation : ${new Date(report.generatedAt).toLocaleString("fr-FR")} par ${report.validatedBy}`,
                    x: 40,
                    y,
                    font: "F1",
                    size: 11,
                });
                y -= 16;
                entries.push({
                    text: `Localisation : ${report.city} (${report.department})`,
                    x: 40,
                    y,
                    font: "F1",
                    size: 11,
                });
                y -= 16;
                entries.push({
                    text: `Valeur du point : ${this.formatNumber(report.pointEuroValue)} EUR`,
                    x: 40,
                    y,
                    font: "F1",
                    size: 11,
                });
                y -= 16;
                entries.push({
                    text: `Delais : declaration ${report.maxDeclarationDelay} j | validation ${report.maxValidationDelay} j | contestation ${report.maxContestationDelay} j`,
                    x: 40,
                    y,
                    font: "F1",
                    size: 11,
                });
                y -= 28;
            } else {
                entries.push({
                    text: `Rapport de reinitialisation - ${report.guildName} - page ${pageIndex + 1}`,
                    x: 40,
                    y,
                    font: "F2",
                    size: 14,
                });
                y -= 28;
            }

            entries.push({ text: "Membre", x: 40, y, font: "F4", size: 10 });
            entries.push({ text: "Email", x: 250, y, font: "F4", size: 10 });
            entries.push({ text: "Solde final", x: 560, y, font: "F4", size: 10 });
            entries.push({ text: "Valeur EUR", x: 680, y, font: "F4", size: 10 });
            y -= 16;
            entries.push({
                text: "--------------------------------------------------------------------------------------------------------------",
                x: 40,
                y,
                font: "F3",
                size: 9,
            });
            y -= 16;

            chunk.forEach((line) => {
                const memberLabel = this.truncate(
                    `${line.lastname} ${line.firstname}`.trim() || line.lastname,
                    34
                );
                const emailLabel = this.truncate(line.email, 38);

                entries.push({ text: memberLabel, x: 40, y, font: "F3", size: 9 });
                entries.push({ text: emailLabel, x: 250, y, font: "F3", size: 9 });
                entries.push({
                    text: this.formatNumber(line.pointsBalance),
                    x: 560,
                    y,
                    font: "F3",
                    size: 9,
                });
                entries.push({
                    text: this.formatNumber(line.euroValue),
                    x: 680,
                    y,
                    font: "F3",
                    size: 9,
                });
                y -= 16;
            });

            pages.push(entries);
        });

        return this.createPdfDocument(pages.map((page) => this.buildContent(page)));
    }
}

export default PdfManager;
