import type { Locale } from "./routing";

import adminAnalyticsKz from "./messages/kz/admin-analytics.json";
import adminCoursesKz from "./messages/kz/admin-courses.json";
import adminSidebarKz from "./messages/kz/admin-sidebar.json";
import adminSubscriptionsKz from "./messages/kz/admin-subscriptions.json";
import adminUsersKz from "./messages/kz/admin-users.json";
import changeLanguageKz from "./messages/kz/change-language.json";
import coursesKz from "./messages/kz/courses.json";
import changePasswordKz from "./messages/kz/change-password.json";
import changeRegionKz from "./messages/kz/change-region.json";
import dashboardAnalyticsKz from "./messages/kz/dashboard-analytics.json";
import dashboardMenuKz from "./messages/kz/dashboard-menu.json";
import dashboardSidebarKz from "./messages/kz/dashboard-sidebar.json";
import errorsKz from "./messages/kz/errors.json";
import headerKz from "./messages/kz/header.json";
import homeKz from "./messages/kz/home.json";
import lessonPlayerKz from "./messages/kz/lesson-player.json";
import profileKz from "./messages/kz/profile.json";
import takeTestKz from "./messages/kz/take-test.json";
import requireAuthKz from "./messages/kz/require-auth.json";
import signInKz from "./messages/kz/sign-in.json";
import signUpKz from "./messages/kz/sign-up.json";
import subscriptionKz from "./messages/kz/subscription.json";
import updateProfileKz from "./messages/kz/update-profile.json";
import adminAnalyticsRu from "./messages/ru/admin-analytics.json";
import adminCoursesRu from "./messages/ru/admin-courses.json";
import adminSidebarRu from "./messages/ru/admin-sidebar.json";
import adminSubscriptionsRu from "./messages/ru/admin-subscriptions.json";
import adminUsersRu from "./messages/ru/admin-users.json";
import changeLanguageRu from "./messages/ru/change-language.json";
import coursesRu from "./messages/ru/courses.json";
import changePasswordRu from "./messages/ru/change-password.json";
import changeRegionRu from "./messages/ru/change-region.json";
import dashboardAnalyticsRu from "./messages/ru/dashboard-analytics.json";
import dashboardMenuRu from "./messages/ru/dashboard-menu.json";
import dashboardSidebarRu from "./messages/ru/dashboard-sidebar.json";
import errorsRu from "./messages/ru/errors.json";
import headerRu from "./messages/ru/header.json";
import homeRu from "./messages/ru/home.json";
import lessonPlayerRu from "./messages/ru/lesson-player.json";
import profileRu from "./messages/ru/profile.json";
import takeTestRu from "./messages/ru/take-test.json";
import requireAuthRu from "./messages/ru/require-auth.json";
import signInRu from "./messages/ru/sign-in.json";
import signUpRu from "./messages/ru/sign-up.json";
import subscriptionRu from "./messages/ru/subscription.json";
import updateProfileRu from "./messages/ru/update-profile.json";

const messages = {
  kz: {
    adminAnalytics: adminAnalyticsKz,
    adminCourses: adminCoursesKz,
    adminSidebar: adminSidebarKz,
    adminSubscriptions: adminSubscriptionsKz,
    adminUsers: adminUsersKz,
    changeLanguage: changeLanguageKz,
    changePassword: changePasswordKz,
    changeRegion: changeRegionKz,
    courses: coursesKz,
    dashboardAnalytics: dashboardAnalyticsKz,
    dashboardMenu: dashboardMenuKz,
    dashboardSidebar: dashboardSidebarKz,
    errors: errorsKz,
    header: headerKz,
    home: homeKz,
    lessonPlayer: lessonPlayerKz,
    profile: profileKz,
    requireAuth: requireAuthKz,
    signIn: signInKz,
    signUp: signUpKz,
    subscription: subscriptionKz,
    takeTest: takeTestKz,
    updateProfile: updateProfileKz,
  },
  ru: {
    adminAnalytics: adminAnalyticsRu,
    adminCourses: adminCoursesRu,
    adminSidebar: adminSidebarRu,
    adminSubscriptions: adminSubscriptionsRu,
    adminUsers: adminUsersRu,
    changeLanguage: changeLanguageRu,
    changePassword: changePasswordRu,
    changeRegion: changeRegionRu,
    courses: coursesRu,
    dashboardAnalytics: dashboardAnalyticsRu,
    dashboardMenu: dashboardMenuRu,
    dashboardSidebar: dashboardSidebarRu,
    errors: errorsRu,
    header: headerRu,
    home: homeRu,
    lessonPlayer: lessonPlayerRu,
    profile: profileRu,
    requireAuth: requireAuthRu,
    signIn: signInRu,
    signUp: signUpRu,
    subscription: subscriptionRu,
    takeTest: takeTestRu,
    updateProfile: updateProfileRu,
  },
} satisfies Record<
  Locale,
  {
    adminAnalytics: typeof adminAnalyticsKz;
    adminCourses: typeof adminCoursesKz;
    adminSidebar: typeof adminSidebarKz;
    adminSubscriptions: typeof adminSubscriptionsKz;
    adminUsers: typeof adminUsersKz;
    changeLanguage: typeof changeLanguageKz;
    changePassword: typeof changePasswordKz;
    changeRegion: typeof changeRegionKz;
    courses: typeof coursesKz;
    dashboardAnalytics: typeof dashboardAnalyticsKz;
    dashboardMenu: typeof dashboardMenuKz;
    dashboardSidebar: typeof dashboardSidebarKz;
    errors: typeof errorsKz;
    header: typeof headerKz;
    home: typeof homeKz;
    lessonPlayer: typeof lessonPlayerKz;
    profile: typeof profileKz;
    requireAuth: typeof requireAuthKz;
    signIn: typeof signInKz;
    signUp: typeof signUpKz;
    subscription: typeof subscriptionKz;
    takeTest: typeof takeTestKz;
    updateProfile: typeof updateProfileKz;
  }
>;

export function loadMessages(locale: Locale) {
  return messages[locale];
}
