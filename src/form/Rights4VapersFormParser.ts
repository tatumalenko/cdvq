/* eslint-disable max-len */
import Constants from "../Constants";
import FormParser from "./FormParser";

export default class Rights4VapersFormParser extends FormParser {
    constructor() {
        super({
            formFields: Constants.R4V_SURVEY_FORM_FIELDS
        });
    }
}
