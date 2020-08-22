/* eslint-disable max-classes-per-file */
import FormData from "form-data";
import got, { Response } from "got";
import Constants from "../Constants";
import { KeyValues } from "./FormParser";

export class Rights4VapersSurveyResponse {
    readonly response: Response<string>;

    readonly success: boolean;

    constructor(response: Response<string>) {
        this.response = response;
        this.success = response.body.includes(Constants.R4V_SURVEY_FORM_SUCCESS_MESSAGE);
    }
}

export default class Rights4VapersSurvey {
    readonly keyValues: KeyValues[];

    readonly form: FormData;

    constructor(keyValues: KeyValues[]) {
        this.keyValues = Rights4VapersSurvey
            .withOtherRequiredFields(Rights4VapersSurvey
                .withNameField(keyValues));

        const form = new FormData();

        for (const keyValue of this.keyValues) {
            if (keyValue.formField?.isList) {
                for (const value of keyValue.value) {
                    form.append(keyValue.key, value);
                }
            } else if (keyValue.value.first()) {
                form.append(keyValue.key, keyValue.value.first());
            }
        }

        this.form = form;
    }

    private static withNameField(keyValues: KeyValues[]): KeyValues[] {
        const nameKey = "input_1.3";
        const nameKeyValues = keyValues.first((kv) => kv.key === nameKey);

        if (!nameKeyValues) {
            return keyValues;
        }

        const [ firstName, lastName ] = nameKeyValues.value
            .at(0)
            ?.splitOnceLast(Constants.R4V_SURVEY_FORM_FIELD_NAME_DELIMITER) ?? [ "", "" ];

        const allButNameKeyValues = keyValues.filter((kv) => kv.key !== nameKey);

        return [
            {
                key: Constants.R4V_SURVEY_FORM_FIELD_NAME_FIRST_KEY,
                value: [ firstName ],
                formField: nameKeyValues.formField
            }, {
                key: Constants.R4V_SURVEY_FORM_FIELD_NAME_LAST_KEY,
                value: [ lastName ],
                formField: nameKeyValues.formField
            },
            ...allButNameKeyValues
        ];
    }

    private static withOtherRequiredFields(keyValues: KeyValues[]): KeyValues[] {
        return [
            ...keyValues,
            ...Constants.R4V_SURVEY_FORM_FIELDS_OTHER
        ];
    }

    async send(): Promise<Rights4VapersSurveyResponse> {
        const response = await got.post("https://www.rights4vapers.com/fr/sondage/", {
            body: this.form
        });
        return new Rights4VapersSurveyResponse(response);
    }

    stringify(): string {
        return this.keyValues.reduce((acc, keyValue) => {
            if (keyValue.formField?.isList) {
                return acc + keyValue.value.reduce((a, s) => `${a}${Constants.NEWLINE}${keyValue.key}${s}`, "");
            } else if (keyValue.value.first()) {
                return `${acc}${Constants.NEWLINE}${keyValue.key}${keyValue.value.first()}`;
            }
            return acc;
        }, "");
    }
}
