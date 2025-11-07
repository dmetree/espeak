// 'use client';
// import { GlobalStyle } from '@/components/shared/themes/global-styles';
// import { ThemeProvider } from 'styled-components';
// import { useLocalStorage } from 'usehooks-ts';
// import { StyledComponentsRegistry } from './registry';
// import { defaultTheme } from '@/components/shared/themes/default';

// type Props = {
//   children: React.ReactNode;
// };

// export const StyledProvider = ({ children }: Props) => {
//   const [theme] = useLocalStorage('theme', defaultTheme);

//   return (
//     <StyledComponentsRegistry>
//       <ThemeProvider theme={theme}>
//         <GlobalStyle />
//         {children}
//       </ThemeProvider>
//     </StyledComponentsRegistry>
//   );
// };
