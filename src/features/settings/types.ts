export type SettingsActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialSettingsActionState: SettingsActionState = {
  status: "idle",
  message: "",
};
