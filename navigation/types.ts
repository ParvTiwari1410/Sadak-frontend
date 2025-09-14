export type RootStackParamList = {
  Splash: undefined
  Onboarding: undefined
  Auth: undefined
  MainTabs: { userRole: "citizen" | "authority" }
  Report: undefined
  MyReports: undefined
  Authority: undefined
}

export type MainTabParamList = {
  // 1. Add userRole here to fix the first error
  Home: { userRole: "citizen" | "authority" };
  Feed: undefined;
  Report: undefined;
  Profile: undefined;

  // 2. Add these screens to fix the navigation errors
  MyReports: undefined;
  Authority: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
