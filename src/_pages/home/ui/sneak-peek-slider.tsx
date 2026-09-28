"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  Search,
  Bell,
  PlayCircle,
  BookOpenIcon,
  GraduationCapIcon,
  TimerIcon,
  FlameIcon,
  ChevronRight,
  CheckCircle2,
  Circle,
  ChevronLeft,
  Clock,
  Check,
  Trophy,
  Target,
} from "lucide-react";

export function SneakPeekSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const t = useTranslations("home.sneakPeek.slider");

  const slides = [
    { id: "dashboard", label: t("dashboard.tab") },
    { id: "test", label: t("test.tab") },
    { id: "analytics", label: t("analytics.tab") },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(index)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeSlide === index
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl">
        {/* Browser Header */}
        <div className="flex h-12 items-center border-b border-border/80 bg-muted/30 px-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="mx-auto flex h-6 w-1/2 items-center justify-center rounded-md bg-background/80 text-[10px] text-muted-foreground shadow-sm">
            app.tarih.kz / {slides[activeSlide].id}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative flex h-[460px] w-full sm:h-[520px]">
          {/* SLIDE 1 & 3: Dashboard (Overview & Analytics) */}
          <div
            className={`absolute inset-0 flex transition-opacity duration-700 ${
              activeSlide === 0 || activeSlide === 2
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Sidebar */}
            <div className="hidden w-56 flex-col border-r border-border/80 bg-muted/5 p-4 sm:flex">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <div className="h-4 w-24 rounded-md bg-primary/20" />
              </div>
              <div className="space-y-1">
                {[
                  {
                    icon: LayoutDashboard,
                    label: t("dashboard.title"),
                    active: true,
                  },
                  { icon: BookOpen, label: t("dashboard.myCourses") },
                  { icon: FileText, label: t("dashboard.tests") },
                  { icon: Settings, label: t("dashboard.settings") },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex h-10 items-center gap-3 rounded-md px-3 transition-colors ${
                      item.active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden bg-background">
              {/* Header */}
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 px-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{t("dashboard.title")}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground font-medium">
                    {t("dashboard.overview")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="h-8 w-8 rounded-full bg-primary/20" />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 space-y-8 overflow-y-auto p-6 relative">
                <div
                  className={`transition-all duration-700 absolute inset-0 p-6 space-y-8 ${activeSlide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  {/* Dashboard: Continue Learning */}
                  <div>
                    <h2 className="text-xl font-semibold font-heading mb-4">
                      {t("dashboard.continueLearning")}
                    </h2>
                    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <PlayCircle className="size-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {t("dashboard.courseName")}
                          </p>
                          <p className="font-medium text-base">
                            {t("dashboard.lessonName")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("dashboard.watched")}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{t("dashboard.courseProgress")}</span>
                          <span>28%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full w-[28%] bg-primary rounded-full" />
                        </div>
                      </div>
                      <div className="h-9 w-32 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-2">
                        {t("dashboard.continueButton")}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-700 absolute inset-0 p-6 space-y-8 ${activeSlide === 2 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  {/* Dashboard: Analytics */}
                  <div>
                    <h2 className="text-xl font-semibold font-heading mb-4">
                      {t("dashboard.statisticsTitle")}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      {[
                        {
                          icon: BookOpenIcon,
                          label: t("dashboard.statCourses"),
                          value: "2",
                          detail: t("dashboard.statCoursesDetail"),
                        },
                        {
                          icon: GraduationCapIcon,
                          label: t("dashboard.statLessons"),
                          value: "14",
                          detail: "",
                        },
                        {
                          icon: TimerIcon,
                          label: t("dashboard.statTime"),
                          value: t("dashboard.statTimeValue"),
                          detail: "",
                        },
                        {
                          icon: FlameIcon,
                          label: t("dashboard.statStreak"),
                          value: "5",
                          detail: t("dashboard.statStreakDetail"),
                        },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-2 rounded-2xl border border-border/60 p-4 shadow-sm"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <stat.icon className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                              {stat.label}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-col">
                            <span className="text-2xl font-semibold">
                              {stat.value}
                            </span>
                            {stat.detail && (
                              <span className="text-xs text-muted-foreground">
                                {stat.detail}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border/60 p-5 shadow-sm">
                      <p className="text-sm text-muted-foreground">
                        {t("dashboard.testsTaken")}
                      </p>
                      <p className="mt-1 text-3xl font-semibold">24</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t("dashboard.testsTakenDetail")}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 p-5 shadow-sm bg-primary/5">
                      <p className="text-sm font-medium text-primary">
                        {t("dashboard.subscriptionTitle")}
                      </p>
                      <p className="mt-1 text-xl font-semibold">
                        {t("dashboard.subscriptionPlan")}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t("dashboard.subscriptionDays")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 2: Test Taking */}
          <div
            className={`absolute inset-0 flex flex-col transition-opacity duration-700 bg-background ${
              activeSlide === 1
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Test Header */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 px-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{t("dashboard.myCourses")}</span>
                <ChevronRight className="h-3 w-3" />
                <span>{t("test.lesson")}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">
                  {t("test.quiz")}
                </span>
              </div>
            </div>

            {/* Test Content */}
            <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-10">
              <div className="mx-auto w-full max-w-3xl space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold font-heading">
                    {t("test.title")}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {t("test.description")}
                  </p>
                </div>

                <hr className="border-border/60" />

                {/* Question */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      1
                    </div>
                    <div className="space-y-4 pt-1 w-full">
                      <p className="text-lg font-medium leading-relaxed">
                        {t("test.question")}
                      </p>

                      {/* Options */}
                      <div className="space-y-3">
                        {[
                          { text: t("test.opt1"), selected: true },
                          { text: t("test.opt2"), selected: false },
                          { text: t("test.opt3"), selected: false },
                          { text: t("test.opt4"), selected: false },
                        ].map((opt, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                              opt.selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border/60 bg-muted/5 hover:bg-muted/10"
                            }`}
                          >
                            {opt.selected ? (
                              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                            )}
                            <span className={opt.selected ? "font-medium" : ""}>
                              {opt.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-6">
                  <div className="h-10 px-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {t("test.finishButton")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/50" />
      </div>
    </div>
  );
}
