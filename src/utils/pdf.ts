import { PDFCheckBox, PDFDocument, PDFForm, PDFTextField } from "pdf-lib";
import type { PlayerInformation } from "../types/player-information";
import type { Format, VGCTeam } from "@kasp470f/showdown-to-vgc";

export async function generatePDF(vgcTeam: VGCTeam, info: PlayerInformation, format: Format, teamName: string | undefined): Promise<void> {
	if (!vgcTeam) return;

	const pdfBytes = await fetch("champions.pdf").then((res) => res.arrayBuffer());
	if (!pdfBytes) {
		console.error(`Failed to load PDF template from public/champions.pdf`);
		return;
	}

	await PDFDocument.load(pdfBytes).then((pdfDoc) => {
		const form = pdfDoc.getForm();
		setTextField(form, "Player ID", info?.playerId?.toString() ?? '')
		setTextField(form, "Support ID", info?.supportId?.toString() ?? '')
		setDateFields(form, info?.dateOfBirth)

		for (let i = 0; i < 2; i++) {
			setTextField(form, getFieldName("Player Name", i), info?.playerName ?? '')
			setTextField(form, getFieldName("Trainer Name in Game", i), info?.trainerName ?? '')
			setTextField(form, getFieldName("Battle Team Number Name", i), info?.battleTeamName ?? '')
			setTextField(form, getFieldName("Switch Profile Name", i), info?.switchName ?? '')
			setCheckBox(form, info?.division ?? null, i)
		}

		for (let i = 0; i < vgcTeam.length; i++) {
			const poke = vgcTeam[i];

			setPokemonTextFields(form, "Pokémon", i, poke.name!);
			if (format === "champions") {
				setPokemonTextFields(form, "Stat Alignment", i, poke.nature || ""); // Set nature in the stat alignment field if available, otherwise leave it blank
			} else {
				setStatTextField(form, `Level`, i, poke.level!);
				setPokemonTextFields(form, "Tera Type", i, poke.teraType!);
			}
			setPokemonTextFields(form, "Ability", i, poke.ability!);
			setPokemonTextFields(form, "Held Item", i, poke.item!);

			setStatTextField(form, `HP`, i, poke.stats.hp);
			setStatTextField(form, `Atk`, i, poke.stats.atk);
			setStatTextField(form, `Def`, i, poke.stats.def);
			setStatTextField(form, `Sp Atk`, i, poke.stats.spa);
			setStatTextField(form, `Sp Def`, i, poke.stats.spd);
			setStatTextField(form, `Speed`, i, poke.stats.spe);

			for (let j = 0; j < poke.moves!.length; j++) {
				setPokemonTextFields(form, `Move ${j + 1}`, i, poke.moves![j]);
			}
		}

		pdfDoc.save().then((data) => {
			const filename = `${teamName}_filled_vgc_team_sheet.pdf`;
			download(data, filename, "application/pdf");
		});
	});
}

function download(data: Uint8Array, filename: string, type: string): void {
	const blob = new Blob([data as BlobPart], { type: type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}


function getFieldName(fieldName: string, i: number): string {
	if (i > 0 && i < 7) i += 1;

	return [fieldName, i].filter((i) => i !== 0).join("_");
}


function setTextField(form: PDFForm, fieldName: string, fieldValue: string): void {
	const field = form.getField(fieldName);
	if (field == undefined) {
		console.warn(`Field ${fieldName} not found`);
		return;
	}

	(field as PDFTextField).setText(fieldValue);
}

function setStatTextField(form: PDFForm, fieldName: string, i: number, value: string | number): void {
	const indexedFieldName = getFieldName(fieldName, i);

	const fieldValue = typeof value === "number" ? value.toString() : value;
	setTextField(form, indexedFieldName, fieldValue);
}

function setPokemonTextFields(form: PDFForm, fieldName: string, i: number, value: string): void {
	const CTS_FieldName = getFieldName(fieldName, i); // CTS: Closed Team Sheet
	const OTS_FieldName = getFieldName(fieldName, i + 7); // OTS: Open Team Sheet

	setTextField(form, CTS_FieldName, value);
	setTextField(form, OTS_FieldName, value);
}


function setCheckBox(form: PDFForm, fieldName: string | null, i: number): void {
	if (fieldName == null) return;

	const field = form.getField(getFieldName(fieldName, i));
	if (field == undefined) {
		console.warn(`Field ${fieldName} not found`);
		return;
	}

	(field as PDFCheckBox).check();
}

function getLocaleDateOrder(locale: string): Array<'day' | 'month' | 'year'> {
	const parts = new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).formatToParts(new Date(2000, 11, 31));

	return parts
		.filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
		.map((part) => part.type as 'day' | 'month' | 'year');
}

function setDateFields(form: PDFForm, dateOfBirth: Date | undefined): void {
	if (dateOfBirth == null) return;

	const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-GB';
	const order = getLocaleDateOrder(locale);

	const values = {
		day: dateOfBirth.getDate().toString().padStart(2, '0'),
		month: (dateOfBirth.getMonth() + 1).toString().padStart(2, '0'),
		year: dateOfBirth.getFullYear().toString().padStart(4, '0'),
	};

	setTextField(form, 'Text1', values[order[0]]);
	setTextField(form, 'Text2', values[order[1]]);
	setTextField(form, 'Text3', values[order[2]]);
}

