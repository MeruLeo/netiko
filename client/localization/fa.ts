import { enUS } from "@clerk/localizations";

export const faIR = {
  ...enUS, // بر اساس انگلیسی پیش‌فرض
  signIn: {
    start: {
      title: "ورود به حساب",
      subtitle: "لطفا مشخصات خود را وارد کنید",
      actionText: "ورود",
    },
  },
  signUp: {
    start: {
      title: "ایجاد حساب کاربری",
      subtitle: "لطفا مشخصات خود را پر کنید",
      actionText: "ثبت نام",
    },
  },
  userButton: {
    action__signOut: "خروج",
    action__manageAccount: "مدیریت حساب",
  },
};
