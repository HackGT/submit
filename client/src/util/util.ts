import { Rule } from "antd/es/form";

export const FORM_RULES = {
  requiredRule: {
    required: true,
    message: "This field is required."
  },
  urlRule: {
    type: "url",
    message: "Please enter a valid URL."
  } as Rule,
  emailRule: {
    type: "email",
    message: "Please enter a valid email."
  } as Rule
};
