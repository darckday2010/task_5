// src/app/providers/ThemeProvider.tsx
import React, { PropsWithChildren } from "react";
import { Theme, presetGpnDefault } from "@consta/uikit/Theme";

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
	return <Theme preset={presetGpnDefault}>{children}</Theme>;
};
