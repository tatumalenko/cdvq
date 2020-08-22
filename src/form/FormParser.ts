import Constants from "../Constants";
import FormParserConfig, { FormField } from "./FormParserConfig";

export type KeyValue = { key: string, value: string};

export type KeyValues = { key: string, value: string[], formField?: FormField};

export default class FormParser {
    private config: FormParserConfig;

    constructor(config: FormParserConfig) {
        this.config = config;
    }

    process(parsable: string): KeyValues[] {
        const parsables: KeyValue[] = parsable
            .split(Constants.NEWLINE)
            .map((line) => {
                const [ first, second ] = line.splitOnceLast(Constants.KEY_VALUE_DELIMITER);
                return {
                    key: first.trim(),
                    value: second.trim()
                };
            })
            .filterNotNone();

        return this.config.formFields.reduce((acc, formField) => {
            const foundParsable = parsables.first((e) => e.key === formField.key);

            if (foundParsable) {
                let { key } = foundParsable;
                const { value } = foundParsable;
                let values: string[];

                if (formField.newKey) {
                    key = formField.newKey;
                }

                if (formField.isList) {
                    values = value.split(Constants.LIST_DELIMITER).map((e) => e.trim());
                } else {
                    values = [ value ];
                }

                if (formField.transform) {
                    values = values.map(formField.transform);
                }

                return [
                    ...acc, {
                        key,
                        value: values,
                        formField
                    }
                ];
            }

            return acc;
        }, []);
    }
}
