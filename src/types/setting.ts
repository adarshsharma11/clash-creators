export type SettingValue = string | number | boolean | Record<string, unknown> | unknown[];

export type PlatformSetting = {
  key: string;
  value: SettingValue;
  description: string | null;
  updatedAt: string;
};

export type UpdateSettingInput = {
  value: SettingValue;
};
