export const applyTheme = (selectedTheme: string) => {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }

  const root = document.documentElement;

  const themeVariables =
    selectedTheme === "dark-theme"
      ? {
          // Core Colors
          "--borderRadius": "4px",
          "--borderBottom": "#BBC2FA",
          "--bodyColor": "#1d1f28",
          "--bannerBgColor": "#3F3D56",
          "--bgColor": "#1d1f28",
          "--textColor": "#a5a5a5",
          "--font": "Mulish",
          "--oppositeBgColor": "#ffffff",
          "--oppositeTextColor": "#3F3D56",

          // Palette and Button Styles
          "--common-black": "#3F3D56",
          "--common-white": "#ffffff",
          "--primary-main": "#F59E0B",
          "--primary-contrastText": "#3F3D56",
          "--secondary-main": "#F59E0B",
          "--secondary-contrastText": "#ffffff",
          "--button-primary-main": "#F59E0B",
          "--button-primary-contrastText": "#3F3D56",
          "--button-secondary-main": "#ffffff",
          "--button-secondary-contrastText": "#3F3D56",

          // Shadows and Transparency
          "--boxShadow": "rgba(0, 0, 0, 0.5)",
          "--lightShadow": "rgba(0, 0, 0, 0.2)",
          "--bgColorTransparent": "rgba(29, 31, 40, 0.9)",

          // Additional Colors
          "--light": "#fae4b9",
          "--highLight": "#ab5601",
          "--text": "#1d1f28",
          "--white": "#e8eeed",
          "--dark": "#429084",
          "--darkTransparent": "rgba(66, 144, 132, 0.5)",
          "--darker": "#377b78",
          "--darkest": "#074c49",

          "--walletPrimary": "#0070f3",
        }
      : {
          // Core Colors
          "--borderRadius": "4px",
          "--borderBottom": "#BBC2FA",
          "--bodyColor": "#FAFAFA",
          "--bannerBgColor": "#FAFAFA",
          "--bgColor": "#e8eeed",
          "--textColor": "#353535",
          "--font": "Mulish",
          "--oppositeBgColor": "#3F3D56",
          "--oppositeTextColor": "#ffffff",

          // Palette and Button Styles
          "--common-black": "#121212",
          "--common-white": "#FAFAFA",
          "--primary-main": "#F59E0B",
          "--primary-contrastText": "#FAFAFA",
          "--secondary-main": "#FAFAFA",
          "--secondary-contrastText": "#F59E0B",
          "--button-primary-main": "#F59E0B",
          "--button-primary-contrastText": "#FAFAFA",
          "--button-secondary-main": "#FAFAFA",
          "--button-secondary-contrastText": "#F59E0B",

          // Shadows and Transparency
          "--boxShadow": "rgba(0, 0, 0, 0.5)",
          "--lightShadow": "rgba(0, 0, 0, 0.2)",
          "--bgColorTransparent": "rgba(232, 238, 237, 0.6)",

          // Additional Colors
          "--light": "#fae4b9",
          "--highLight": "#ab5601",
          "--text": "#dee7e5",
          "--white": "#e8eeed",
          "--dark": "#429084",
          "--darkTransparent": "rgba(66, 144, 132, 0.5)",
          "--darker": "#377b78",
          "--darkest": "#074c49",

          "--walletPrimary": "#0070f3",
        };

  // Apply the variables
  Object.entries(themeVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
